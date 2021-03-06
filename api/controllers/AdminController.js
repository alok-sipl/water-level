/**
 * UserController
 *
 * @description :: Server-side logic for managing admin
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebase = require("firebase");
var storageBucket = sails.config.globals.storageBucket();
var async = require('async');

module.exports = {
  /*
   * Name: index
   * Created By: A-SIPL
   * Created Date: 28-jan-2018
   * Purpose: show grid page
   * @param  req
   */
  index: function (req, res) {
    if (req.session.isSuperAdmin == true) {
      return res.view('admin-listing', {
        'title': sails.config.title.admin_list
      });
    } else {
      return res.redirect(sails.config.base_url + 'dashboard');
    }
  },


  /*
   * Name: adminlist
   * Created By: A-SIPL
   * Created Date: 30-jan-2018
   * Purpose: show grid with data
   * @param  req, res
   */
  adminlist: function (req, res) {
    /* admin listing*/
    admins = [];
    var ref = db.ref("users");
    ref.orderByChild("is_admin").equalTo(true).once('value', function (snap) {
      var adminJson = (Object.keys(snap).length) ? getAdminList(snap, (req.session.userid) != undefined ? req.session.userid : '') : {};
      return res.json({'rows': adminJson});
    });
  },


  /*
   * Name: add
   * Created By: A-SIPL
   * Created Date: 29-jan-2018
   * Purpose: create other admin
   * @param  req, res
   */
  add: function (req, res) {
    if (req.session.isSuperAdmin == true) {
      var errors = {};
      var user = {};
      /* Checking validation if form post */
      if (req.method == "POST") {
        errors = ValidationService.validate(req);
        if (Object.keys(errors).length) {
          return res.view('add-update-admin', {
            'isEdit': false,
            'user': user,
            'title': sails.config.title.add_admin,
            'errors': errors
          });
        } else {
          var ref = db.ref("users");
          ref.orderByChild("email").equalTo(req.param('email')).once('value')
            .then(function (snapshot) {
              user = snapshot.val();
              if (user) {
                if (user.is_admin == true) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist_in_admin + '</div>');
                  return res.redirect(sails.config.base_url + 'admin/add');
                } else {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist_in_user + '</div>');
                  return res.redirect(sails.config.base_url + 'admin/add');
                }
              } else {
                firebase.auth().createUserWithEmailAndPassword(req.param('email').trim(), req.param('password').trim())
                  .then(function () {
                    user = firebase.auth().currentUser;
                    //user.sendEmailVerification();
                  })
                  .then(function () {
                    var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
                    var ref = db.ref("users");
                    var data = {
                      id: user.uid,
                      name: req.param('name').trim(),
                      email: req.param('email').trim(),
                      password: req.param('password').trim(),
                      phone: req.param('mobile_number').trim(),
                      is_deleted: status,
                      is_admin: true,
                      is_device_notification_enable: true,
                      is_user_notification_enable: true,
                      created_at: Date.now(),
                      modified_at: Date.now(),
                    }
                    ref.push(data).then(function () {
                      MailerService.sendWelcomeMail({
                        name: req.param('name').trim(),
                        email: req.param('email').trim(),
                        subject: sails.config.email_message.new_admin,
                        isAdmin: true
                      });
                      req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.admin_add_success + '</div>');
                      return res.redirect(sails.config.base_url + 'admin');
                    }, function (error) {
                      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.admin_add_error + '</div>');
                      return res.redirect(sails.config.base_url + 'admin');
                    });
                  })
                  .catch(function (error) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.admin_add_error + '</div>');
                    return res.redirect(sails.config.base_url + 'admin');
                  });
              }
            }).catch(function (err) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.redirect(sails.config.base_url + 'admin');
          });
        }
      } else {
        return res.view('add-update-admin', {
          'isEdit': false,
          'user': user,
          'title': sails.config.title.add_admin,
          'errors': errors
        });
      }
    } else {
      return res.redirect(sails.config.base_url + 'dashboard');
    }
  },


  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 30-jan-2018
   * Purpose: show grid with data
   * @param  req
   */
  view: function (req, res) {
    if (req.session.isSuperAdmin == true) {
      /* user detail */
      var errors = {};
      var ref = db.ref("users/" + req.params.id);
      ref.once("value", function (snapshot) {
        var user = snapshot.val();
        if (user != null) {
          return res.view('view-edit-admin', {
            'title': sails.config.title.view_admin,
            'user': user, errors: errors,
            'isEdit': false,
          });
        } else {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'admin');
        }
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    } else {
      return res.redirect(sails.config.base_url + 'dashboard');
    }
  },


  /*
 * Name: edit
 * Created By: A-SIPL
 * Created Date: 30-jan-2018
 * Purpose: edit other admin
 * @param  req, res
 */
  edit: function (req, res) {
    if (req.session.isSuperAdmin == true) {
      if (req.method == "POST") {
        errors = ValidationService.validate(req);
        if (Object.keys(errors).length) {
          var ref = db.ref("users/" + req.params.id);
          ref.once("value", function (snapshot) {
            var user = snapshot.val();
            if (user != undefined) {
              var countries = snapshot.val();
              return res.view('add-update-admin', {
                'title': sails.config.title.edit_admin,
                'user': user,
                'errors': errors,
                'isEdit': true,
              });
            } else {
              return res.serverError();
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        } else {
          var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
          var ref = db.ref("users/" + req.params.id);
          ref.once("value", function (snapshot) {
            var user = snapshot.val();
            if (user != undefined) {
              var ref = db.ref();
              db.ref('users/' + req.params.id)
                .update({
                  'name': req.param('name').trim(),
                  'phone': req.param('mobile_number').trim(),
                  'is_deleted': status,
                  'modified_at': Date.now(),
                })
                .then(function () {
                  req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                  return res.redirect(sails.config.base_url + 'admin');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.user_edit_error + '</div>');
                  return res.redirect(sails.config.base_url + 'admin/edit/' + req.params.id);
                });
            } else {
              return res.serverError();
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        }
      } else {
        /* user detail */
        var errors = {};
        var ref = db.ref("users/" + req.params.id);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          if (user != null) {
            return res.view('add-update-admin', {
              'title': sails.config.title.edit_admin,
              'user': user,
              'errors': errors,
              'isEdit': true,
            });
          } else {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.redirect(sails.config.base_url + 'admin');
          }
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }
    } else {
      return res.redirect(sails.config.base_url + 'dashboard');
    }
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
    var ref = db.ref('/users/' + id);
    ref.once("value", function (snapshot) {
      if (snapshot.val()) {
        db.ref('/users/' + id)
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

  /*
   * Name: delete
   * Created By: A-SIPL
   * Created Date: 20-feb-2018
   * Purpose: delete admin
   * @param  req
   */
  delete: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('/users/' + id)
        .remove()
        .then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
          return res.json({'status': true, message: sails.config.flash.delete_successfully});
        })
        .catch(function (err) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },

};


/*
   * Name: getUserList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getAdminList(snap, adminId) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {

      admin = childSnap.val();
      updateAdmin = admin;
      updateAdmin.id = childSnap.key;
      if (adminId != childSnap.key) {
        admins.push(updateAdmin);
      }
    });
    admins.sort(function (a, b) {
      return b.created_at - a.created_at;
    })
    return admins;
  } else {
    cities = {}
    return cities;
  }
}

