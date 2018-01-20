/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {
    /*
     * Name: supplierListing
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
    readingNotification: function (req, res) {
        // console.log('Device reading param param-->', req.body);
        // if (req.body != undefined && req.body.alertLevel != undefined && req.body.deviceBatteryLevel != undefined && req.body.deviceId != undefined && req.body.deviceName != undefined && req.body.intervalInMinutes != undefined && req.body.mobileBatteryLevel != undefined && req.body.tankHeight != undefined && req.body.tankReading != undefined && req.body.userId != undefined) {
        //     var userDetail = db.ref("users");
        //     userDetail.orderByChild('id').equalTo(req.body.userId).once("value",
        //             function (snapshot) {
        //                 var userInfo = snapshot.val();
        //                 if (userInfo != undefined && userInfo != '') {
        //                     var userKey = (Object.keys(userInfo)[0]) ? Object.keys(userInfo)[0] : 0;
        //                     if (userInfo[userKey].is_user_notification != undefined && userInfo[userKey].is_user_notification == true) {
        //                         var ref = db.ref("tokens/" + readingKey);
        //                         ref.once("value", function (snapshot) {
        //                             var deviceDetail = snapshot.val();
        //                             if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
        //                                 if (req.body.mobileBatteryLevel < sails.config.min_battery_level) {
        //                                     var info = {
        //                                         userId: readingKey,
        //                                         type: 'low_mobile_battery',
        //                                         title: 'Mobile battery is low',
        //                                         body: 'Your  ' + req.body.deviceName + ' mobile/ipad battery at minimum level. Please charge your mobile.',
        //                                     }
        //                                     for (var key in deviceDetail) {
        //                                         info.token = deviceDetail[key].device_token;
        //                                         NotificationService.sendNotification(info);
        //                                     }
        //                                     var ref = db.ref("alerts/" + readingKey);
        //                                     var data = {
        //                                         percentage: 0,
        //                                         message: info.body,
        //                                         type: 'low_mobile_battery',
        //                                     }
        //                                     ref.push(data).then(function () {
        //                                     });
        //                                 }
        //                                 if (req.body.mobileBatteryLevel < sails.config.min_device_battery_level) {
        //                                     var info = {
        //                                         userId: readingKey,
        //                                         type: 'low_device_battery',
        //                                         title: 'Device battery is low',
        //                                         body: 'Your device battery at minimum level. Charge ' + req.body.mobileBatteryLevel + ' device battery',
        //                                     }
        //                                     for (var key in deviceDetail) {
        //                                         info.token = deviceDetail[key].device_token;
        //                                         NotificationService.sendNotification(info);
        //                                     }
        //                                     var ref = db.ref("alerts/" + readingKey);
        //                                     var data = {
        //                                         percentage: 0,
        //                                         message: info.body,
        //                                         type: 'low_device_battery',
        //                                     }
        //                                     ref.push(data).then(function () {
        //                                     });
        //                                 }
        //                                 if (req.body.alertLevel > req.body.tankReading) {
        //                                     var info = {
        //                                         userId: readingKey,
        //                                         type: 'low_tank_level',
        //                                         title: req.body.deviceName + ' is content only ' + req.body.tankReading + ' water level',
        //                                         body: 'Your tank ' + req.body.deviceName + ' is content only ' + req.body.tankReading + ' water. Please fill the tank as soon as posible',
        //                                     }
        //                                     for (var key in deviceDetail) {
        //                                         info.token = deviceDetail[key].device_token;
        //                                         NotificationService.sendNotification(info);
        //                                     }
        //                                     var ref = db.ref("alerts/" + readingKey);
        //                                     var data = {
        //                                         percentage: req.body.tankReading,
        //                                         message: info.body,
        //                                         type: 'low_tank_level',
        //                                     }
        //                                     ref.push(data).then(function () {
        //                                     });
        //                                 }
        //                                 //console.log(snapshot.val());
        //                                 //onsole.log(readingKey);
        //                             }
        //                         });
        //                     } else {
        //                         return res.json([]);
        //                     }
        //                 } else {
        //                     return res.json([]);
        //                 }
        //
        //             });
        // } else {
        //     console.log('false...');
        //     return res.serverError('parameter missing');
        // }
    },

    /*
     * Name: supplierListing
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
    addReading: function (req, res) {
        var ref = db.ref("device_reading");
        ref.push({
            mobile_battery_level: 5,
            device_battery_level: 25,
            interval_in_minutes: 10,
            alert_level: 25,
            tank_reading: 40,
            tank_height: 140,
            user_id: 'UYyYrL1jbgO4hPpy8YjOihDu8Tq2',
            device_id: '123',
            device_name: 'Home',
            created_at: Date.now(),
            is_deleted: false,
            updated_at: Date.now()
        }).then(function () {
            console.log('Push success-->', new Date());
            res.json({res: 'true'})
        }, function (error) {
            console.log('error', error);
            res.json({res: 'false'})
        });
    },

    readingIndex: function (req, res) {
//        ref = db.ref('device_reading');
//        ref.limitToLast(1).on('child_added', function (snapshot) {
//            var ref = db.ref("/device_reading/" + snapshot.key);
//            ref.limitToLast(1).once("value", function (innnerSnapshot) {
//                console.log("/device_reading/" + snapshot.key);
//                console.log('Inner value array',innnerSnapshot.val());
//            }, function (errorObject) {
//                return res.serverError(errorObject.code);
//            });
//
//        });
    }
}


