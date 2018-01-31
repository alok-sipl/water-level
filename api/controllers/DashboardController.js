/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();
var firebase = require("firebase");
var validator = require('validator');

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: dashboard of the user
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('dashboard', {});
  },

  /*
     * Name: profile
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: update profile
     * @param  req
     */
  profile: function (req, res) {
    var errors = {};
    var user = {};
    var countries = {};
    var cities = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        /* user detail */
        var ref = db.ref("users/" + req.session.userid);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          /* country listing*/
          var ref = db.ref("countries");
          ref.orderByChild("is_deleted").equalTo(false)
            .once("value", function (snapshot) {
              var countries = snapshot.val();
              /* city listing*/
              var ref = db.ref("cities");
              ref.orderByChild("is_deleted").equalTo(false)
                .once("value", function (snapshot) {
                  var cities = snapshot.val();
                  return res.view('profile', {
                    'title': sails.config.title.edit_profile,
                    'user': user, "countries": countries,
                    'cities': cities,
                    'errors': errors
                  });
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var ref = db.ref();
        db.ref('users/' + req.session.userid)
          .update({
            'name': req.param('name'),
            'account_number': req.param('account_number'),
            'country_id': req.param('country'),
            'country_name': req.param('country_name'),
            'city_id': req.param('city'),
            'city_name': req.param('city_name'),
            'area': req.param('area'),
            'latitude': parseFloat(req.param('latitude')),
            'longitude': parseFloat(req.param('longitude'))
          }).then(function () {
          user = firebaseAuth.auth().currentUser;
        })
          .then(function () {
            req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.profile_update_success + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/profile');
          })
          .catch(function (err) {
            console.log("In error-->", err);
            req.flash('flashMessage', '<div class="flash-message alert alert-error">' + sails.config.flash.profile_update_error + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/profile');
          });
      }
    } else {
      /* user detail */
      if (req.session.userid !== undefined && req.session.userid) {
        var ref = db.ref("users/" + req.session.userid);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          /* country listing*/
          var ref = db.ref("countries");
          ref.orderByChild("is_deleted").equalTo(false)
            .once("value", function (snapshot) {
              var countries = snapshot.val();
              /* city listing*/
              var ref = db.ref("cities");
              ref.orderByChild("is_deleted").equalTo(false)
                .once("value", function (snapshot) {
                  var cities = snapshot.val();
                  return res.view('profile', {
                    'title': sails.config.title.edit_profile,
                    'user': user, "countries": countries,
                    'cities': cities,
                    'errors': errors
                  });
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        return res.redirect(sails.config.base_url + 'login');
      }
    }

  },


  /*
   * Name: createAdmin
   * Created By: A-SIPL
   * Created Date: 29-jan-2018
   * Purpose: create other admin
   * @param  req, res
   */
  createAdmin: function (req, res) {
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
        ref.orderByChild("email").equalTo(req.param('email')).once('child_added')
          .then(function (snapshot) {
            user = snapshot.val();
            if (user) {
              if (user.is_admin == true) {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist_in_admin + '</div>');
                return res.redirect(sails.config.base_url + 'dashboard/createAdmin');
              } else {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist_in_user + '</div>');
                return res.redirect(sails.config.base_url + 'dashboard/createAdmin');
              }
            } else {
              firebase.auth().createUserWithEmailAndPassword(req.param('email').trim(), req.param('password').trim())
                .then(function () {
                  user = firebase.auth().currentUser;
                })
                .then(function () {
                  var status = (req.param('status') == "false") ? false : true;
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
                    created_date: Date.now(),
                    modified_date: Date.now(),
                  }
                  ref.push(data).then(function () {
                    req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.admin_add_success + '</div>');
                    return res.redirect(sails.config.base_url + 'dashboard/admin');
                  }, function (error) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.admin_add_error + '</div>');
                    return res.redirect(sails.config.base_url + 'dashboard/admin');
                  });
                })
                .catch(function (error) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.admin_add_error + '</div>');
                  return res.redirect(sails.config.base_url + 'dashboard/admin');
                });
            }


          }).catch(function (err) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'supplier');
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

  },


  /*
   * Name: viewAdmin
   * Created By: A-SIPL
   * Created Date: 30-jan-2018
   * Purpose: show grid with data
   * @param  req
   */
  viewAdmin: function (req, res) {
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.once("value", function (snapshot) {
      var user = snapshot.val();
      return res.view('view-edit-admin', {
        'title': sails.config.title.view_admin,
        'user': user, errors: errors,
        'isEdit': false,
      });
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },


  /*
 * Name: editAdmin
 * Created By: A-SIPL
 * Created Date: 30-jan-2018
 * Purpose: edit other admin
 * @param  req, res
 */
  editAdmin: function (req, res) {
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
                  'modified_date': Date.now(),
                })
                .then(function () {
                  req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                  return res.redirect(sails.config.base_url + 'user');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-error">' + sails.config.flash.user_edit_error + '</div>');
                  return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                });
          } else {
            return res.serverError();
          }
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }
  } else{
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.once("value", function (snapshot) {
      var user = snapshot.val();
          return res.view('add-update-admin', {
            'title': sails.config.title.edit_user,
            'user': user,
            'errors': errors,
            'isEdit': true,
          });
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  }
},

/*
 * Name: admin
 * Created By: A-SIPL
 * Created Date: 30-jan-2018
 * Purpose: listing of admin
 * @param  req, res
 */
admin: function (req, res) {
  return res.view('admin-listing', {
    'title': sails.config.title.user_list
  });
}
,


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
}
,


/*
 * Name: changePassword
 * Created By: A-SIPL
 * Created Date: 20-dec-2017
 * Purpose: chnage password of admin
 * @param  req
 */
changePassword: function (req, res) {
  var errors = {};
  if (req.method == "POST") {
    errors = ValidationService.validate(req);
    if (Object.keys(errors).length) {
      return res.view('profile', {
        'title': sails.config.title.change_password,
        'user': user,
        'errors': errors
      });
    } else {
      var user = firebaseAuth.auth().currentUser;
      if (user) {
        var credentials = firebaseAuth.auth.EmailAuthProvider.credential(
          user.email,
          req.param('current_password')
        );
        user.reauthenticateWithCredential(credentials).then(function () {
          user.updatePassword(req.param('new_password').trim()).then(function () {
            var ref = db.ref();
            var status = (req.param('status') == "false") ? false : true;
            db.ref('users/' + req.session.userid)
              .update({
                'password': req.param('new_password').trim()
              })
              .then(function () {
                req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.password_change_success + '</div>');
                return res.redirect(sails.config.base_url + 'dashboard/changePassword');
              })
              .catch(function (err) {
                req.flash('flashMessage', '<div class="flash-message alert alert-error">' + sails.config.flash.password_change_error + '</div>');
                return res.redirect(sails.config.base_url + 'dashboard/changePassword');
              });
          }).then(function () {
            req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.password_change_success + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/changePassword');
          }).catch(function (error) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.password_change_error + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/changePassword');
          });
        }).catch(function (error) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.old_password_unmatch + '</div>');
          return res.redirect(sails.config.base_url + 'dashboard/changePassword');
        });
      } else {
        return res.redirect(sails.config.base_url + 'dashboard/changePassword');
      }
    }
  } else {
    return res.view('change-password', {title: sails.config.title.change_password, "errors": errors});
  }
}
,


/*
   * Name: logout
   * Created By: A-SIPL
   * Created Date: 13-dec-2017
   * Purpose: for  logout the admin
   * @param  req
   */
logout: function (req, res) {
  req.session.user = {};
  req.session.authenticated = false;
  req.session.destroy(function (err) {
    return res.redirect('/');
  });
}
,

/*
   * Name: sendMail
   * Created By: A-SIPL
   * Created Date: 26-dec-2017
   * Purpose: send mail
   * @param  req
   */
sendMail: function (req, res) {
  MailerService.sendWelcomeMail({
    name: "Alok",
    email: "alok.bichhwe@systematixindia.com",
    subject: "User is deactiveated by admin"
  });
}
,

/*
   * Name: setting
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: for  notification setting of admin
   * @param  req
   */
setting: function (req, res) {
  if (req.session.userid !== undefined && req.session.userid) {
    /* admin detail */
    var ref = db.ref("users/" + req.session.userid);
    ref.once("value", function (snapshot) {
      var userDetail = snapshot.val();
      if (userDetail) {
        return res.view('notification-setting', {
          title: sails.config.title.notification_setting,
          userDetail: userDetail
        });
      } else {
        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect(sails.config.base_url + 'dashboard/setting');
      }
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  } else {
    return res.redirect(sails.config.base_url + 'login');
  }
}
,


/*
   * Name: updateSetting
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: for  notification setting of admin
   * @param  req
   */
updateSetting: function (req, res) {
  if (req.body.type == 'is_device_notification') {
    var ref = db.ref();
    db.ref('/users/' + req.session.userid)
      .update({
        'is_device_notification_enable': req.body.value
      })
      .then(function () {
        return res.json({'status': true, message: sails.config.flash.update_successfully});
      })
      .catch(function (err) {
        return res.json({'status': false, message: sails.config.flash.something_went_wronge});
      });
  } else {
    var ref = db.ref();
    db.ref('/users/' + req.session.userid)
      .update({
        'is_user_notification_enable': req.body.value
      })
      .then(function () {
        return res.json({'status': true, message: sails.config.flash.update_successfully});
      })
      .catch(function (err) {
        return res.json({'status': false, message: sails.config.flash.something_went_wronge});
      });
  }
}
,

/*
* Name: getAdminNotification
* Created By: A-SIPL
* Created Date: 23-jan-2018
* Purpose: get notification of the admin
* @param  req
*/
getAdminNotification: function (req, res) {
  var adminId = (req.session.user != undefined) ? req.session.user.uid : '1';
  db.ref('alerts/' + adminId).limitToLast(sails.config.notification_limit).once('value')
    .then(function (snapshot) {
      var notificationList = snapshot.val();
      res.locals.layout = '';
      return res.view('notification', {alertList: DateService.reverseObject(notificationList)});
    }).catch(function (err) {
    return res.view('notification', {alertList: {}});
  });
}

}
;

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
      return b.created_date - a.created_date;
    })
    return admins;
  } else {
    cities = {}
    return cities;
  }
}

