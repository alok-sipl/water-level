/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var storageBucket = sails.config.globals.storageBucket();
var async = require('async');

module.exports = {
  /*
   * Name: index
   * Created By: A-SIPL
   * Created Date: 8-dec-2017
   * Purpose: sjpw grid page
   * @param  req
   */
  index: function (req, res) {
    return res.view('user-listing', {
      'title': sails.config.title.user_list
    });
  },

  /*
   * Name: userlist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  userlist: function (req, res) {
    /* country listing*/
    users = [];
    var ref = db.ref("users");
    ref.orderByChild("is_admin").equalTo(false).once('value', function (snap) {
      if (Object.keys(snap).length) {
        var count = 1;
        var tempSnap = snap;
        snap = snap.val();
        var tempBinRecords = [];
        _.map(snap,function (val, user_key){
          val.user_key = user_key;
          tempBinRecords.push(val)
        });
        async.forEach(tempBinRecords, function (childSnap, callback) {
          var deviceList = ''
          if (childSnap.id != undefined) {
            var ref = db.ref('/devices/' + childSnap.id);
            ref.once("value", function (snapshot) {
              var devices = snapshot.val();
              if (devices != null && Object.keys(devices).length) {
                for (var key in devices) {
                  deviceList += devices[key].device_name + ', ';
                }
              }
            }).then(function (snapshot) {
              updateUser = childSnap;
              updateUser.user_id = childSnap.user_key;
              updateUser.device = deviceList.substring(0, deviceList.length-2);;
              users.push(updateUser);
              if (tempSnap.numChildren() == count) {
                return res.json({'rows': users});
              }
              count++;
            }).catch(function (err) {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
              return res.redirect(sails.config.base_url + 'supplier');
            });
          }
          callback();
        });

      } else {
        users = {}
        return users;
      }
    });
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  view: function (req, res) {
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.once("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      if(user != null){
        var ref = db.ref("countries");
        ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            var countries = snapshot.val();
            return res.view('view-edit-user', {
              'title': sails.config.title.view_user,
              'user': user, errors: errors,
              'countries': countries,
              'isEdit': false,
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
      }else{
        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
        res.redirect(sails.config.base_url + 'user');
      }
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
   * Name: edit
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  edit: function (req, res) {
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        var ref = db.ref("users/" + req.params.id);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          if (user != undefined) {
                var countries = snapshot.val();
                return res.view('view-edit-user', {
                  'title': sails.config.title.edit_user,
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
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        req.file('image').upload({
          saveAs:function(file, handler) {
            handler(null,'../../assets/images'+"/"+file.filename);
          },
          maxBytes: sails.config.length.max_file_upload
        }, function whenDone(err, uploadedFiles) {
          if (err) {
            var ref = db.ref("users/" + req.params.id);
            ref.once("value", function (snapshot) {
              var user = snapshot.val();
              if (user != undefined) {
                    return res.view('view-edit-user', {
                      'title': sails.config.title.edit_user,
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
          }
          if (uploadedFiles.length === 0) {
            var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
            var ref = db.ref("users/" + req.params.id);
            ref.once("value", function (snapshot) {
              var user = snapshot.val();
              if (user != undefined) {
                var ref = db.ref();
                db.ref('users/' + req.params.id)
                  .update({
                    'name': req.param('name').trim(),
                    // 'account_number': req.param('account_number').trim(),
                    // 'country_id': req.param('country').trim(),
                    // 'country_name': req.param('country_name').trim(),
                    // 'city_id': req.param('city').trim(),
                    // 'city_name': req.param('city_name').trim(),
                    //'area': req.param('area').trim(),
                    'address': req.param('address').trim(),
                    //'latitude': parseFloat(req.param('latitude')),
                    //'longitude': parseFloat(req.param('longitude')),
                    'is_deleted': status
                  })
                  .then(function (res) {
                    if (status != user.is_deleted) {
                      MailerService.sendWelcomeMail({
                        name: user.name,
                        email: user.email,
                        subject: (status == false) ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
                      });
                    }
                  })
                  .then(function () {
                    req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                    return res.redirect(sails.config.base_url + 'user');
                  })
                  .catch(function (err) {
                    console.log("in error-->", err);
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.user_edit_error + '</div>');
                    return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                  });
              } else {
                return res.serverError();
              }
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
            errors['image'] = {message: WaterSupplier.message.invalid_file}
            var ref = db.ref("users/" + req.params.id);
            ref.once("value", function (snapshot) {
              var user = snapshot.val();
              if (user != undefined) {
                /* city listing*/
                // var ref = db.ref("countries");
                // ref.orderByChild("is_deleted").equalTo(false)
                //   .once("value", function (snapshot) {
                //     var countries = snapshot.val();
                    return res.view('view-edit-user', {
                      'title': sails.config.title.edit_user,
                      'user': user,
                      'errors': errors,
                      //'countries': countries,
                      'isEdit': true,
                    });
                  // }, function (errorObject) {
                  //   return res.serverError(errorObject.code);
                  // });
              } else {
                return res.serverError();
              }
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          } else {
            storageBucket.upload('assets/images/'+uploadedFiles[0].filename, function (err, file) {
              if (!err) {
                var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
                var ref = db.ref("users/" + req.params.id);
                ref.once("value", function (snapshot) {
                  var user = snapshot.val();
                  if (user != undefined) {
                    var ref = db.ref();
                    const file = storageBucket.file(uploadedFiles[0].filename);
                    return file.getSignedUrl({
                      action: 'read',
                      expires: '03-09-2491'
                    }).then(function (signedUrls) {
                      db.ref('users/' + req.params.id)
                        .update({
                          'name': req.param('name').trim(),
                          // 'account_number': req.param('account_number').trim(),
                          // 'country_id': req.param('country').trim(),
                          // 'country_name': req.param('country_name').trim(),
                          // 'city_id': req.param('city').trim(),
                          // 'city_name': req.param('city_name').trim(),
                          // 'area': req.param('area').trim(),
                          // 'latitude': parseFloat(req.param('latitude')),
                          // 'longitude': parseFloat(req.param('longitude')),
                          'address': req.param('address').trim(),
                          'is_deleted': status,
                          'profile_picture': signedUrls[0],
                          'modified_at': Date.now(),
                        })
                        .then(function (res) {
                          if (status != user.is_deleted) {
                            MailerService.sendWelcomeMail({
                              name: user.name,
                              email: user.email,
                              subject: (status == false) ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
                            });
                          }
                        })
                        .then(function () {
                          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                          return res.redirect(sails.config.base_url + 'user');
                        })
                        .catch(function (err) {
                          console.log("in error-->", err);
                          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.user_edit_error + '</div>');
                          return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                        });
                    }).catch(function (err) {
                      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.user_edit_error + '</div>');
                      return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                    });
                  } else {
                    return res.serverError();
                  }
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });

              } else {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + err + '</div>');
                return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
              }
            });
          }
        });
      }
    } else {
      /* user detail */
      var errors = {};
      var ref = db.ref("users/" + req.params.id);
      ref.once("value", function (snapshot) {
        var user = snapshot.val();
        if(user != null){
          /* city listing*/
          // var ref = db.ref("countries");
          // ref.orderByChild("is_deleted").equalTo(false)
          //   .once("value", function (snapshot) {
          //     var countries = snapshot.val();
              return res.view('view-edit-user', {
                'title': sails.config.title.edit_user,
                'user': user,
                'errors': errors,
                //'countries': countries,
                'isEdit': true,
              });
            // }, function (errorObject) {
            //   return res.serverError(errorObject.code);
            // });
        }else{
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          res.redirect(sails.config.base_url + 'user');
        }
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
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
            'is_deleted': (status == 'true') ? true : false,
            'modified_at': Date.now(),
          })
          .then(function (res) {
            userinfo = snapshot.val();
            MailerService.sendWelcomeMail({
              name: userinfo.name,
              email: userinfo.email,
              subject: (status == true || status == 'true') ? sails.config.email_message.user_deactivated : sails.config.email_message.user_activated
            });
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


  imageUpload: function () {
    bucket.upload('alok/if_9_2698684.png', function(err, file) {
      console.log(file);
      if (!err) {

        const file = bucket.file('if_9_2698684.png');
        return file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        }).then(signedUrls => {
          console.log("signedUrls==",signedUrls);
      });
      }else{
        console.log(err);
      }
    });
  }
};

/*
 * Name: getUserList
 * Created By: A-SIPL
 * Created Date: 20-dec-2017
 * Purpose: sget the user grid dat
 * @param  req
 */
function getUserList(snap) {
  if (Object.keys(snap).length) {
    var count = 1;
    snap.forEach(function (childSnap) {
      user = childSnap.val();
      var deviceList = ''
      if (user.id != undefined) {
        var ref = db.ref('/devices/' + user.id);
        ref.once("value", function (snapshot) {
          var devices = snapshot.val();
          if (devices != null && Object.keys(devices).length) {
            for (var key in devices) {
              deviceList += devices[key].device_name + ', ';
            }
          }
        }).then(function (snapshot) {
          updateUser = user;
          updateUser.user_id = childSnap.key;
          updateUser.device = deviceList;
          //console.log(updateUser, '==');
          users.push(updateUser);
          console.log(snap.numChildren(), '==', count);
          if (snap.numChildren() == count) {
            console.log('In-condition', users);
            // users.sort(function (a, b) {
            //   return b.created_at - a.created_at;
            // })
            return res.json({'name': 'Alok'});
          }
          count++;
        }).catch(function (err) {
          //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          //return res.redirect(sails.config.base_url + 'supplier');
        });
      }
    });

  } else {
    users = {}
    return users;
  }
}


