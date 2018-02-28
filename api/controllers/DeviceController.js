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
      if (Object.keys(snap).length) {
        var count = 0;
        var tempSnap = snap;
        snap = snap.val();
        var tempBinRecords = [];
        _.map(snap, function (val, device_key) {
          val.device_key = device_key;
          tempBinRecords.push(val)
        });

        async.forEach(tempBinRecords, function (childSnap, callback) {
          console.log(childSnap);
          var deviceList = ''
          var userName = '';
          var lastReading = 0;
          var deviceName = '';
          if (childSnap.id != undefined && childSnap.user_id != undefined) {
            var ref = db.ref('/devices/' + childSnap.user_id + '/' + childSnap.id);
            ref.once("value", function (snapshot) {
              var deviceDetail = snapshot.val();
              if(deviceDetail != null && deviceDetail.device_name != undefined && deviceDetail.updated_at != undefined){
                deviceName = deviceDetail.device_name
                lastReading = deviceDetail.updated_at;
                var ref = db.ref('users/');
                ref.orderByChild("id").equalTo(childSnap.user_id).once("child_added", function (firstSnapshot) {
                  var userDetail = firstSnapshot.val();
                  if(userDetail != null && userDetail.name != undefined){
                    userName = userDetail.name;
                    updateUser = childSnap;
                    updateUser.device_name = deviceName;
                    updateUser.user_name = userName;
                    updateUser.last_reading = (lastReading != 0) ? DateService.timeSince(lastReading) : 'N/A';
                    devices.push(updateUser);
                    count++;
                  }else{
                    userName = '';
                    updateUser = childSnap;
                    updateUser.device_name = deviceName;
                    updateUser.user_name = userName;
                    updateUser.last_reading = (lastReading != 0) ? DateService.timeSince(lastReading) : 'N/A';
                    console.log('**-->', deviceDetail, updateUser.last_reading, '<--**');
                    devices.push(updateUser);
                    count++;
                  }
                  if (tempSnap.numChildren() == count) {
                    return res.json({'rows': devices});
                  }
                }, function (errorObject) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                  return res.redirect(sails.config.base_url + 'device');
                });
              }else{
                deviceName = '';
                lastReading = 0;
                updateUser = childSnap;
                updateUser.device_name = deviceName;
                updateUser.user_name = userName;
                updateUser.last_reading = (lastReading != 0) ? DateService.timeSince(lastReading) : 'N/A';
                devices.push(updateUser);
                count++;
                if (tempSnap.numChildren() == count) {
                  return res.json({'rows': devices});
                }
              }
            }, function (errorObject) {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
              return res.redirect(sails.config.base_url + 'device');
          });





























            // var ref = db.ref('/devices/' + childSnap.user_id + '/' + childSnap.id);
            // ref.once("value", function (snapshot) {
            //   var deviceDetail = snapshot.val();
            //   deviceName = (deviceDetail != null && deviceDetail.device_name != undefined) ? deviceDetail.device_name : '';
            //   lastReading = (deviceDetail != null && deviceDetail.updated_at != undefined) ? deviceDetail.updated_at : 0;
            //   var ref = db.ref('users/');
            //   ref.orderByChild("id").equalTo(childSnap.user_id).once("child_added", function (firstSnapshot) {
            //   }).then(function (userSnapshot) {
            //     var userDetail = userSnapshot.val();
            //     userName = (userDetail.name != undefined) ? userDetail.name : '';
            //   }).catch(function (err) {
            //     req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            //     return res.redirect(sails.config.base_url + 'supplier');
            //   });
            // }).then(function (snapshot) {
            //   updateUser = childSnap;
            //   updateUser.device_name = deviceName;
            //   updateUser.user_name = userName;
            //   updateUser.last_reading = DateService.timeSince(lastReading);
            //   devices.push(updateUser);
            //   if (tempSnap.numChildren() == count) {
            //     return res.json({'rows': devices});
            //   }
            //   count++;
            // }).catch(function (err) {
            //   req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            //   return res.redirect(sails.config.base_url + 'supplier');
            // });




          } else {
            updateUser = childSnap;
            updateUser.device_name = '';
            updateUser.user_name = '';
            updateUser.last_reading = 'N/A';
            devices.push(updateUser);
            count++;
            if (tempSnap.numChildren() == count) {
              return res.json({'rows': devices});
            }

          }
          callback();
        });

      } else {
        devices = {}
        return devices;
      }
      //var deviceJson = (Object.keys(snap).length) ? getDeviceList(snap) : {};
      //return res.json({'rows': deviceJson});
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
        return res.view('add-update-device', {
          title: sails.config.title.device_list,
          'device': device,
          "errors": errors,
          req: req
        });
      } else {
        var ref = db.ref("/master_devices");
        ref.orderByChild("device_id").equalTo(req.param('device_id')).once('value')
          .then(function (snapshot) {
            devicedata = snapshot.val();
            if (devicedata) {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('device_id') + sails.config.flash.device_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'device/add');
            } else {
              ref.orderByChild("device_id_iphone").equalTo(req.param('device_id_iphone')).once('value')
                .then(function (snapshot) {
                  devicedataiphone = snapshot.val();
                  if (devicedataiphone) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('device_id_iphone') + sails.config.flash.device_already_exist + '</div>');
                    return res.redirect(sails.config.base_url + 'device/add');
                  } else {
                    var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
                    var ref = db.ref().child("master_devices");
                    var data = {
                      device_id: req.param('device_id'),
                      device_id_iphone: req.param('device_id_iphone'),
                      is_deleted: status,
                      created_at: Date.now(),
                      modified_at: Date.now(),
                    }
                    ref.push(data).then(function () {
                      req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.device_add_success + '</div>');
                      return res.redirect(sails.config.base_url + 'device');
                    }, function (error) {
                      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.device_add_error + '</div>');
                      return res.redirect(sails.config.base_url + 'device/add');
                    });
                  }
                })
                .catch(function (error) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                  return res.redirect(sails.config.base_url + 'device/add');
                })
            }
          })
          .catch(function (error) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.redirect(sails.config.base_url + 'device/add');
          })
      }
    } else {
      return res.view('add-update-device', {title: sails.config.title.edit_device, 'device': device, errors: errors});
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
            title: sails.config.title.edit_device, 'device': device, errors: errors, isEdit: true,
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var ref = db.ref("/master_devices");
        ref.orderByChild("device_id").equalTo(req.param('device_id')).once('value')
          .then(function (snapshot) {
            devicedata = snapshot.val();
            if (devicedata && Object.keys(devicedata)[0] != undefined && req.params.id != Object.keys(devicedata)[0]) {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('device_id') + sails.config.flash.device_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'device/edit/' + req.params.id);
            } else {
              ref.orderByChild("device_id_iphone").equalTo(req.param('device_id_iphone')).once('value')
                .then(function (snapshot) {
                  devicedataiphone = snapshot.val();
                  if (devicedataiphone && Object.keys(devicedataiphone)[0] != undefined && req.params.id != Object.keys(devicedataiphone)[0]) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('device_id_iphone') + sails.config.flash.device_already_exist + '</div>');
                    return res.redirect(sails.config.base_url + 'device/edit/' + req.params.id);
                  } else {
                    var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
                    var ref = db.ref("master_devices/" + req.params.id);
                    ref.once("value", function (snapshot) {
                      var device = snapshot.val();
                      if (device != undefined) {
                        db.ref('master_devices/' + req.params.id)
                          .update({
                            device_id: req.param('device_id'),
                            device_id_iphone: req.param('device_id_iphone'),
                            is_deleted: status,
                            modified_at: Date.now(),
                          }).then(function () {
                          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.device_edit_success + '</div>');
                          return res.redirect(sails.config.base_url + 'device');
                        }, function (error) {
                          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.device_edit_error + '</div>');
                          return res.redirect(sails.config.base_url + 'device/edit/' + req.params.id);
                        });
                      } else {
                        return res.serverError();
                      }
                    });
                  }
                })
                .catch(function (error) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                  return res.redirect(sails.config.base_url + 'device/add');
                })
            }
          })
          .catch(function (error) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.redirect(sails.config.base_url + 'device/add');
          })
      }
    } else {
      var ref = db.ref("master_devices/" + req.params.id);
      ref.once("value", function (snapshot) {
        var device = snapshot.val();
        if (device != null) {
          if (Object.keys(device).length && device.user_id != undefined && device.id != undefined) {
            var ref = db.ref('/devices/' + device.user_id).orderByChild("userId").equalTo(device.user_id)
              .once("child_added", function (snapshot) {
                var deviceDetail = snapshot.val();
                device.device_name = (deviceDetail.device_name != undefined) ? deviceDetail.device_name : '';
                device.location = (deviceDetail.tank_location != undefined) ? deviceDetail.tank_location : 0;
                var ref = db.ref('users').orderByChild("id").equalTo(device.user_id)
                  .once("child_added", function (snapshot) {
                    var userDetail = snapshot.val();
                    if(userDetail != null && userDetail.name != undefined){
                      device.user_name = userDetail.name;
                      return res.view('view-edit-device', {
                        title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: true,
                      });
                    }else{
                      return res.view('view-edit-device', {
                        title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: true,
                      });
                    }
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
              }, function (errorObject) {
                return res.serverError(errorObject.code);
              });

          } else {
            return res.view('view-edit-device', {
              title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: true,
            });
          }
        } else {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'device');
        }
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
      if (device != null) {
        if (Object.keys(device).length && device.user_id != undefined && device.id != undefined) {
          var ref = db.ref('/devices/' + device.user_id).orderByChild("userId").equalTo(device.user_id)
            .once("child_added", function (snapshot) {
              var deviceDetail = snapshot.val();
              device.device_name = (deviceDetail.device_name != undefined) ? deviceDetail.device_name : '';
              device.location = (deviceDetail.tank_location != undefined) ? deviceDetail.tank_location : 0;
              var ref = db.ref('users').orderByChild("id").equalTo(device.user_id)
                .once("child_added", function (snapshot) {
                  var userDetail = snapshot.val();
                  if(userDetail != null && userDetail.name != undefined){
                    device.user_name = userDetail.name;
                    return res.view('view-edit-device', {
                      title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: false,
                    });
                  }else{
                    return res.view('view-edit-device', {
                      title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: false,
                    });
                  }
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
          }, function (errorObject) {
              return res.serverError(errorObject.code);
            });

        } else {
          return res.view('view-edit-device', {
            title: sails.config.title.view_device, 'device': device, errors: errors, isEdit: false,
          });
        }
      } else {
        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect(sails.config.base_url + 'device');
      }
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
  updateStatus: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    var ref = db.ref('/master_devices/' + id);
    ref.once("value", function (snapshot) {
      if (snapshot.val()) {
        db.ref('/master_devices/' + id)
          .update({
            'is_deleted': (status == 'true' || status == true) ? true : false,
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
            return res.json({'status': false, message: sails.config.flash.something_went_wronge});
          });
      } else {
        return res.json({'status': false, message: sails.config.flash.something_went_wronge});
      }
    }, function (errorObject) {
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    });
  },

  /*
 * Name: delete
 * Created By: A-SIPL
 * Created Date: 20-feb-2018
 * Purpose: delete device
 * @param  req
 */
  delete: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('master_devices/' + id)
        .once("value", function (snapshot) {
          var masterDeviceResult = snapshot.val();
          if (masterDeviceResult != null && masterDeviceResult.device_id != undefined) {
            var deviceId = masterDeviceResult.device_id
            db.ref('master_devices/' + id).remove()
              .then(function () {
                console.log('masterDeviceResult.user_id-->', masterDeviceResult.user_id, deviceId);
                if(masterDeviceResult.user_id != undefined && masterDeviceResult.user_id != ''){
                  // db.ref('users/' + masterDeviceResult.user_id)
                  //   .once("value", function (snapshot) {
                  //     var userResult = snapshot.val();
                  //     if (userResult != null && userResult.id != undefined) {
                        db.ref('devices/' + masterDeviceResult.user_id).orderByChild("device_id").equalTo(deviceId)
                          .once('value', function (snapshot) {
                            var deviceReading = snapshot.val();
                            console.log('deviceReading-->', deviceReading);
                            if(deviceReading != null){
                              for (var key in deviceReading) {
                                db.ref('devices/' + masterDeviceResult.user_id + '/' +  key)
                                  .remove()
                                  .then(function () {
                                  }).catch(function (err) {
                                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                                  return res.json({'status': false, message: sails.config.flash.something_went_wronge});
                                });
                                req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                                return res.json({'status': true, message: sails.config.flash.delete_successfully});
                              }
                              req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                              return res.json({'status': true, message: sails.config.flash.delete_successfully});
                            }else{
                              req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                              return res.json({'status': true, message: sails.config.flash.delete_successfully});
                            }
                          }, function (errorObject) {
                            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                            return res.json({'status': false, message: sails.config.flash.something_went_wronge});
                          });
                    //   } else {
                    //     req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                    //     return res.json({'status': false, message: sails.config.flash.something_went_wronge});
                    //   }
                    // }, function (errorObject) {
                    //   req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                    //   return res.json({'status': false, message: sails.config.flash.something_went_wronge});
                    // });
                }else{
                  req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                  return res.json({'status': true, message: sails.config.flash.delete_successfully});
                }
              })
              .catch(function (err) {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                res.json({'status': false, message: sails.config.flash.something_went_wronge});
              });
          } else {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
            return res.json({'status': false, message: sails.config.flash.something_went_wronge});
          }
        }, function (errorObject) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
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
      return b.created_at - a.created_at;
    })
    return devices;
  } else {
    devices = {}
    return devices;
  }
}
