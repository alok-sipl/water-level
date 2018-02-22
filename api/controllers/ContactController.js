/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 22-dec-2017
     * Purpose: show listing of the contact us enqiry
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('contact-listing', {'title': sails.config.title.enquiry_list,});
  },

  /*
   * Name: contactList
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  contactList: function (req, res) {
    /* contact listing*/
    contacts = [];
    var ref = db.ref("queries");
    ref.once('value', function (snap) {
      var contactJson = (Object.keys(snap).length) ? getContactList(snap) : {};
      return res.json({'rows': contactJson});
    });
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: show device detail
   * @param  req
   */
  view: function (req, res) {
    /* contact detail */
    var errors = {};
    var ref = db.ref("queries/" + req.params.id);
    ref.once("value", function (snapshot) {
      var contact = snapshot.val();
      if(contact != null){
        return res.view('view-edit-contact', {
          'title': sails.config.title.view_enquiry,
          'contact': contact,
          'errors': errors,
          'isEdit': false,
        });
      }else{
        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('contact');
      }
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
* Name: updateStatus
* Created By: A-SIPL
* Created Date: 26-dec-2017
* Purpose: UPdate
* @param  req
*/
  updateStatus: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    var ref = db.ref('/queries/' + id);
    ref.once("value", function (snapshot) {
      if (snapshot.val()) {
        db.ref('/queries/' + id)
          .update({
            'is_deleted': (status == 'true' || status == true) ? true : false,
            'modified_at': Date.now(),
          })
          .then(function () {
            return res.json({'status': true, message: sails.config.flash.update_successfully});
          })
          .catch(function (err) {
            return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
          });
      } else {
        return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
      }
    }, function (errorObject) {
      return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
    });
  },
};


/*
   * Name: getDeviceList
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: get the device grid data
   * @param  req
   */
function getContactList(snap) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      contact = childSnap.val();
      updateContact = contact;
      updateContact.contact_id = childSnap.key;
      contacts.push(updateContact);
    });
    contacts.sort(function (a, b) {
            return b.created_at - a.created_at;
        })
    return contacts;
  } else {
    contacts = {}
    return contacts;
  }
}
