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
     * Created Date: 8-dec-2017
     * Purpose: show listing of the device
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('device-listing', {title: sails.config.title.device_list,});
  },

  /*
   * Name: devicelist
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  devicelist: function (req, res) {
    /* device listing*/
    devices = [];
    var ref = db.ref("master_devices");
    ref.once('value', function (snap) {
      var deviceJson = (Object.keys(snap).length) ? getDeviceList(snap) : {};
      return res.json({'rows': deviceJson});
    });
  },


  /*
     * Name: add
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new device
     * @param  req
     */
  add: function (req, res) {
    var device = {};
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
        return res.view('add-update-device', {title: sails.config.title.device_list,'device': device, "errors": errors, req: req});
      } else {
        var ref = db.ref("/master_devices");
        ref.orderByChild("device_id").equalTo(req.param('device_id')).once('value')
          .then(function (snapshot) {
            devicedata = snapshot.val();
            if (devicedata) {
              req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('device_id') + sails.config.flash.device_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'device/add');
            } else {
              var status = (req.param('status') == "false") ? false : true;
              var ref = db.ref().child("master_devices");
              var data = {
                device_id: req.param('device_id'),
                is_deleted: status,
                created_at: Date.now(),
                modified_at: Date.now(),
              }
              ref.push(data).then(function () {
                req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.device_add_success + '</div>');
                return res.redirect(sails.config.base_url + 'device');
              }, function (error) {
                req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.device_add_error + '</div>');
                return res.redirect(sails.config.base_url + 'device/add');
              });
            }
          })
          .catch(function (error) {
            req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.redirect(sails.config.base_url + 'device/add');
          })
      }
    } else {
      return res.view('add-update-device', {title: sails.config.title.edit_device,'device': device, errors: errors});
    }
  },

  /*
     * Name: edit
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  edit: function (req, res) {
    var device = {};
    var isFormError = false;
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        var ref = db.ref("master_devices/" + req.params.id);
        ref.once("value", function (snapshot) {
          var device = snapshot.val();
          return res.view('view-edit-device', {
            title: sails.config.title.edit_device,'device': device, errors: errors, isEdit: true,
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }else{
        var status = (req.param('status') == "false") ? false : true
        var ref = db.ref("master_devices/" + req.params.id);
        ref.once("value", function (snapshot) {
          var device = snapshot.val();
          if (device != undefined) {
            db.ref('master_devices/' + req.params.id)
              .update({
                device_id: req.param('device_id'),
                is_deleted: status,
                modified_at: Date.now(),
              }).then(function () {
              req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.device_edit_success + '</div>');
              return res.redirect(sails.config.base_url + 'device');
            }, function (error) {
              req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.device_edit_error + '</div>');
              return res.redirect(sails.config.base_url + 'device/edit/' + req.params.id);
            });
          } else {
            return res.serverError();
          }
        });
      }
    }else {
      /* supplier detail */
      var ref = db.ref("master_devices/" + req.params.id);
      ref.once("value", function (snapshot) {
        var device = snapshot.val();
        return res.view('view-edit-device', {
          title: sails.config.title.edit_device,'device': device, errors: errors, isEdit: true,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: show device detail
   * @param  req
   */
  view: function (req, res) {
    /* device detail */
    var errors = {};
    var ref = db.ref("master_devices/" + req.params.id);
    ref.once("value", function (snapshot) {
      var device = snapshot.val();
      return res.view('view-edit-device', {
        title: sails.config.title.view_device,'device': device, errors: errors, isEdit: false,
      });
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
 * Name: updateStatus
 * Created By: A-SIPL
 * Created Date: 26-dec-2017
 * Purpose: Update status of device
 * @param  req
 */
  updateStatus:function(req, res){
    var id = req.body.id;
    var status = req.body.is_active;
    var ref = db.ref('/master_devices/'+ id);
    ref.once("value", function (snapshot) {
      if(snapshot.val()){
        db.ref('/master_devices/'+ id)
          .update({
            'is_deleted': (status == 'true')? true : false
          })
          .then(function () {
            userinfo = snapshot.val();
            MailerService.sendWelcomeMail({
              name: userinfo.name,
              email: userinfo.email,
              subject: (status) ? sails.config.email_message.device_activated : sails.config.email_message.device_deactivated
            });
            return res.json({'status': true, message: sails.config.flash.update_successfully});
          })
          .catch(function (err) {
            console.log('111',err);
            return res.json({'status': false, message: sails.config.flash.something_went_wronge});
          });
      }else{
        console.log('2222');
        return res.json({'status': false, message: sails.config.flash.something_went_wronge});
      }
    }, function (errorObject) {
      console.log('3333',errorObject);
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
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
function getDeviceList(snap) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      device = childSnap.val();
      updateDevice = device;
      updateDevice.device_unique_id = childSnap.key;
      devices.push(updateDevice);
    });
    devices.sort(function (a, b) {
            return b.created_date - a.created_date;
        })
    return devices;
  } else {
    devices = {}
    return devices;
  }
}
