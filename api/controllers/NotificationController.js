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
        ref = db.ref('reading');
        ref.limitToLast(1).on('child_added', function (snapshot) {
            var readingDetail = snapshot.val();
            console.log('key--->', snapshot.key);
            if (snapshot.key && snapshot.key != undefined) {
                var ref = db.ref("users").orderByChild('id').equalTo(snapshot.key);
                ref.once("value", function (snapshot) {
                    var userDetail = snapshot.val();
                    console.log(userDetail);
                    if (userDetail) {
                        if (readingDetail.mobile_battery_level < sails.config.min_battery_level) {
                            var info = {
                                userId: snapshot.key,
                                type: 'low_mobile_battery',
                                title: 'Mobile battery is low',
                                body: 'Your  ' + readingDetail.device_name + ' mobile/ipad battery at minimum level. Please charge your mobile.',
                            }
                            Notification.sendNotification(info);
                        } else if (readingDetail.device_battery_level < sails.config.min_device_battery_level) {
                            var info = {
                                userId: snapshot.key,
                                type: 'low_device_battery',
                                title: 'Device battery is low',
                                body: 'Your device battery at minimum level. Charge ' + readingDetail.device_name + ' device battery',
                            }
                            Notification.sendNotification(info);
                        } else if (readingDetail.alert_level < readingDetail.tank_reading) {
                            var info = {
                                userId: snapshot.key,
                                type: 'low_tank_level',
                                title: readingDetail.device_name + ' is content only ' + readingDetail.tank_reading + ' water level',
                                body: 'Your tank ' + readingDetail.device_name + ' is content only ' + readingDetail.tank_reading + ' water. Please fill the tank as soon as posible',
                            }
                            Notification.sendNotification(info);
                        }

                        console.log(snapshot.val());
                        // get the last inserted key
                        console.log(snapshot.key);
                    }
                    //return res.json({name: "alok"})
                });
            }
        }, function (error) {
            console.error(error);
        });
    },

    readingNotification: function (req, res) {
        var ref = db.ref();
        var reading = ref.child("reading");
        var newCities = reading.push();
        newCities.set({
            mobile_battery_level : 5,
            device_battery_level : 25,
            interval_in_minutes : 10,
            alert_level : 25,
            tank_reading : 40,
            tank_height : 140,
            user_id: 'UYyYrL1jbgO4hPpy8YjOihDu8Tq2',
            device_id :'123',
            device_name: 'Home' ,
            created_at: Date.now(),
            is_deleted:false,
            updated_at:Date.now()});
    },
}


