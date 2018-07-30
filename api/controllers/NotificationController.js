/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {

  /*
   * Name: index
   * Created By: A-SIPL
   * Created Date: 24-jan-2018
   * Purpose: get notification listing
   * @param  req
   */
  index: function (req, res) {
    if (req.session.isSuperAdmin == true) {
      var adminId = (req.session.user != undefined) ? req.session.user.uid : '1';
      db.ref('alerts/' + adminId).once('value')
        .then(function (snapshot) {
          var notificationList = snapshot.val();
          return res.view('notification-listing', {title: sails.config.title.alert_list, alertList: DateService.reverseObject(notificationList)});
        }).catch(function (err) {
        return res.serverError(err);
      });
    } else {
      return res.redirect(sails.config.base_url + 'dashboard');
    }
  },


  /*
   * Name: readingNotification
   * Created By: A-SIPL
   * Created Date: 8-dec-2017
   * Purpose: reading notification
   * @param  req
   */
  readingNotification: function (req, res) {
    console.log('Device reading param param-->', req.body);
    if (req.body != undefined && req.body.alertLevel != undefined && req.body.deviceBatteryLevel != undefined && req.body.deviceId != undefined && req.body.deviceName != undefined && req.body.intervalInMinutes != undefined && req.body.mobileBatteryLevel != undefined && req.body.tankHeight != undefined && req.body.tankReading != undefined && req.body.userId != undefined) {
      var userDetail = db.ref("users");
      userDetail.orderByChild('id').equalTo(req.body.userId).once("value",
        function (snapshot) {
          var userInfo = snapshot.val();
          if (userInfo != undefined && userInfo != '') {
            var userKey = (Object.keys(userInfo)[0]) ? Object.keys(userInfo)[0] : 0;
            if (userInfo[userKey].is_user_notification != undefined && userInfo[userKey].is_user_notification == true) {
              var ref = db.ref("tokens/" + readingKey);
              ref.once("value", function (snapshot) {
                var deviceDetail = snapshot.val();
                if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                  if (req.body.mobileBatteryLevel < sails.config.min_battery_level) {
                    var info = {
                      userId: readingKey,
                      type: 'low_mobile_battery',
                      title: 'Mobile battery is low',
                      body: 'Your  ' + req.body.deviceName + ' mobile/ipad battery at minimum level. Please charge your mobile.',
                      date: Date.now()
                    }
                    for (var key in deviceDetail) {
                      info.token = deviceDetail[key].device_token;
                      NotificationService.sendNotification(info);
                    }
                    var ref = db.ref("alerts/" + readingKey);
                    var data = {
                      percentage: 0,
                      message: info.body,
                      type: 'low_mobile_battery',
                      date: Date.now()
                    }
                    ref.push(data).then(function () {
                    });
                  }
                  if (req.body.mobileBatteryLevel < sails.config.min_device_battery_level) {
                    var info = {
                      userId: readingKey,
                      type: 'low_device_battery',
                      title: 'Device battery is low',
                      body: 'Your device battery at minimum level. Charge ' + req.body.mobileBatteryLevel + ' device battery',
                    }
                    for (var key in deviceDetail) {
                      info.token = deviceDetail[key].device_token;
                      NotificationService.sendNotification(info);
                    }
                    var ref = db.ref("alerts/" + readingKey);
                    var data = {
                      percentage: 0,
                      message: info.body,
                      type: 'low_device_battery',
                      date: Date.now()
                    }
                    ref.push(data).then(function () {
                    });
                  }
                  if (req.body.alertLevel > req.body.tankReading) {
                    var info = {
                      userId: readingKey,
                      type: 'low_tank_level',
                      title: req.body.deviceName + ' is content only ' + req.body.tankReading + ' water level',
                      body: 'Your tank ' + req.body.deviceName + ' is content only ' + req.body.tankReading + ' water. Please fill the tank as soon as posible',
                    }
                    for (var key in deviceDetail) {
                      info.token = deviceDetail[key].device_token;
                      NotificationService.sendNotification(info);
                    }
                    var ref = db.ref("alerts/" + readingKey);
                    var data = {
                      percentage: req.body.tankReading,
                      message: info.body,
                      type: 'low_tank_level',
                      date: Date.now()
                    }
                    ref.push(data).then(function () {
                    });
                  }
                  //console.log(snapshot.val());
                  //onsole.log(readingKey);
                }
              });
            } else {
              return res.json([]);
            }
          } else {
            return res.json([]);
          }

        });
    } else {
      console.log('false...');
      return res.serverError('parameter missing');
    }
  },


}


