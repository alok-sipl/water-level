/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {
    /*
     * Name: getInactiveDevice
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: get inactive device alter at admin
     * @param  req
     */
    getInactiveDevice: function (req, res) {
      var ref = db.ref("users");
      ref.orderByChild("is_admin").equalTo(true)
        .once("child_added", function (snapshot) {
          var userInfore = snapshot.val();
          var adminId =  (userInfore.id != undefined) ? userInfore.id : '';
          if(userInfore.is_device_notification_enable != undefined && (userInfore.is_device_notification_enable == true || userInfore.is_device_notification_enable == 'true')) {
            db.ref('devices').once('child_added')
              .then(function (snapshot) {
                deviceDetail = snapshot.val();
                if (deviceDetail != null && Object.keys(deviceDetail).length) {
                  for (var key in deviceDetail) {
                    var date = new Date();
                    var beforeDate = date.setHours(date.getHours() - sails.config.device_reading_alert_time);
                    if (beforeDate > deviceDetail[key].updated_at) {
                      var ref = db.ref("master_devices");
                      ref.orderByChild("id").equalTo(key)
                        .once("child_added", function (snapshot) {
                          var deviceId = snapshot.key;
                          var data = {
                            message: 'Device ' + deviceDetail[key].device_name + ' (' + deviceDetail[key].device_id + ') is not working properly. Please check',
                            type: 'device_issue',
                            device_id:deviceId,
                            date: Date.now()
                          }
                          var ref = db.ref("alerts/" + adminId);
                          ref.push(data).then(function () {
                            res.json({'msg': 'Alert added sucesfully'})
                          }, function (error) {
                            res.json({'msg': error})
                          });
                        }, function (errorObject) {
                          return res.serverError(errorObject.code);
                        });
                    }else{
                      res.json({'msg': 'Already sent'})
                    }
                  }
                }else{
                  res.json({'msg': 'These has no inactive record'})
                }
              }).catch(function (err) {
              res.json({'msg': err})
            });
          }else{
            res.json({'msg': 'Admin disable setting'})
          }
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });

    },
}


