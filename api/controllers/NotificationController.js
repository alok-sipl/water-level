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
        ref = db.ref('device_reading');
        ref.limitToLast(1).on('child_changed', function (outerSnapshot) {
            console.log("Added items....");
            var ref = db.ref("/device_reading/" + outerSnapshot.key);
            ref.limitToLast(1).once("child_added", function (snapshot) {
                var readingDetail = snapshot.val();
                var readingKey = readingDetail.user_id;
                if (readingKey && readingKey != undefined) {
                    var ref = db.ref("tokens/" + readingKey);
                    ref.once("value", function (snapshot) {
                        var deviceDetail = snapshot.val();
                        if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                            if (readingDetail.mobile_battery_level < sails.config.min_battery_level) {
                                var info = {
                                    userId: readingKey,
                                    type: 'low_mobile_battery',
                                    title: 'Mobile battery is low',
                                    body: 'Your  ' + readingDetail.device_name + ' mobile/ipad battery at minimum level. Please charge your mobile.',
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
                                }
                                ref.push(data).then(function () {
                                });
                            }
                            if (readingDetail.device_battery_level < sails.config.min_device_battery_level) {
                                var info = {
                                    userId: readingKey,
                                    type: 'low_device_battery',
                                    title: 'Device battery is low',
                                    body: 'Your device battery at minimum level. Charge ' + readingDetail.device_name + ' device battery',
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
                                }
                                ref.push(data).then(function () {
                                });
                            }
                            if (readingDetail.alert_level > readingDetail.tank_reading) {
                                var info = {
                                    userId: readingKey,
                                    type: 'low_tank_level',
                                    title: readingDetail.device_name + ' is content only ' + readingDetail.tank_reading + ' water level',
                                    body: 'Your tank ' + readingDetail.device_name + ' is content only ' + readingDetail.tank_reading + ' water. Please fill the tank as soon as posible',
                                }
                                for (var key in deviceDetail) {
                                    info.token = deviceDetail[key].device_token;
                                    NotificationService.sendNotification(info);
                                }
                                var ref = db.ref("alerts/" + readingKey);
                                var data = {
                                    percentage: readingDetail.tank_reading,
                                    message: info.body,
                                    type: 'low_tank_level',
                                }
                                ref.push(data).then(function () {
                                });
                            }
                            //console.log(snapshot.val());
                            //onsole.log(readingKey);
                        }
                    });
                }
            });    
        }, function (error) {
            console.error(error);
        });
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


