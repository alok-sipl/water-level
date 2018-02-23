/**
 * V1/webservices/ReadingController
 *
 * @description :: Server-side logic for managing v1/webservices/readings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var weekDates = [];
var weeekReadings = [];
var weekDaysReadingData = [];

module.exports = {

    /*
     * Name: tankReading
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
    tankReading: function (req, res) {
        console.log('Post param-->', req.body);
        if (req.body != undefined && req.body.deviceId != undefined && req.body.timeFilter != undefined && req.body.type != undefined && req.body.deviceId != '' && req.body.timeFilter != '' && req.body.type != '') {
            var deviceId = req.body.deviceId;
            var timeFilter = req.body.timeFilter;
            var type = req.body.type;
            var deviceReadingList = [];
            if (timeFilter == "day" && type == "history") {
                var refDeviceReading = db.ref("device_reading");
                refDeviceReading.orderByChild('device_id')
                        .equalTo(deviceId)
                        .once("value", function (snapshot) {
                            deviceReadings = snapshot.val();
                            var date = new Date();
                            var sixHourDate = date.setHours(date.getHours() - 6);
                            var date = new Date();
                            var currentdate = date.setSeconds(date.getSeconds() - 1);
                            var fiveCounterReading = 0;
                            var fiveHourCounter = 0;
                            var date = new Date();
                            var fiveHourDate = date.setHours(date.getHours() - 5);
                            var fourCounterReading = 0;
                            var fourHourCounter = 0;
                            var date = new Date();
                            var fourHourDate = date.setHours(date.getHours() - 4);
                            var threeCounterReading = 0;
                            var threeHourCounter = 0;
                            var date = new Date();
                            var threeHourDate = date.setHours(date.getHours() - 3);
                            var twoCounterReading = 0;
                            var twoHourCounter = 0;
                            var date = new Date();
                            var twoHourDate = date.setHours(date.getHours() - 2);
                            var oneCounterReading = 0;
                            var oneHourCounter = 0;
                            var date = new Date();
                            var oneHourDate = date.setHours(date.getHours() - 1);
                            if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
                                for (key in deviceReadings) {
                                    var readingDataObject = {};
                                    if (deviceReadings[key].created_at >= sixHourDate && deviceReadings[key].created_at <= currentdate) {
                                        if (deviceReadings[key].created_at >= fiveHourDate && deviceReadings[key].created_at <= fourHourDate) {
                                            fiveCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            fiveHourCounter++;
                                        } else if (deviceReadings[key].created_at >= fourHourDate && deviceReadings[key].created_at <= threeHourDate) {
                                            fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            fourHourCounter++;
                                        } else if (deviceReadings[key].created_at >= threeHourDate && deviceReadings[key].created_at <= twoHourDate) {
                                            threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            threeHourCounter++;
                                        } else if (deviceReadings[key].created_at >= twoHourDate && deviceReadings[key].created_at <= oneHourDate) {
                                            twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            twoHourCounter++;
                                        } else if (deviceReadings[key].created_at >= oneHourDate) {
                                            oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            oneHourCounter++;
                                        }
                                    }
                                }
                                return res.json([
                                    [{
                                            "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                                            "name": DateService.getFormatedHour(new Date(fiveHourDate + 19800000).getUTCHours())
                                        },
                                        {
                                            "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                                            "name": DateService.getFormatedHour(new Date(fourHourDate + 19800000).getUTCHours())
                                        },
                                        {
                                            "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                                            "name": DateService.getFormatedHour(new Date(threeHourDate + 19800000).getUTCHours())
                                        },
                                        {
                                            "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                                            "name": DateService.getFormatedHour(new Date(twoHourDate + 19800000).getUTCHours())
                                        },
                                        {
                                            "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                                            "name": DateService.getFormatedHour(new Date(oneHourDate + 19800000).getUTCHours())
                                        }
                                    ]
                                ]);
                            } else {
                                return res.json([]);
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
            } else if (timeFilter == "week" && type == "history") {
                var refDeviceReading = db.ref("device_reading");
                refDeviceReading.orderByChild('device_id')
                        .equalTo(deviceId)
                        .once("value", function (snapshot) {
                            deviceReadings = snapshot.val();
                            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var date = new Date();
                            var eigthDayDate = date.setHours(date.getHours() - 192);
                            var date = new Date();
                            var currentdate = date.setSeconds(date.getSeconds() - 1);
                            var sevenCounterReading = 0;
                            var sevenHourCounter = 0;
                            var date = new Date();
                            var sevenDayDate = date.setHours(date.getHours() - 168);
                            var sixCounterReading = 0;
                            var sixHourCounter = 0;
                            var date = new Date();
                            var sixDayDate = date.setHours(date.getHours() - 144);
                            var fiveCounterReading = 0;
                            var fiveHourCounter = 0;
                            var date = new Date();
                            var fiveDayDate = date.setHours(date.getHours() - 120);
                            var fourCounterReading = 0;
                            var fourHourCounter = 0;
                            var date = new Date();
                            var fourDayDate = date.setHours(date.getHours() - 96);
                            var threeCounterReading = 0;
                            var threeHourCounter = 0;
                            var date = new Date();
                            var threeDayDate = date.setHours(date.getHours() - 72);
                            var twoCounterReading = 0;
                            var twoHourCounter = 0;
                            var date = new Date();
                            var twoDayDate = date.setHours(date.getHours() - 48);
                            var oneCounterReading = 0;
                            var oneHourCounter = 0;
                            var date = new Date();
                            var oneDayDate = date.setHours(date.getHours() - 36);

                            if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
                                for (key in deviceReadings) {
                                    var readingDataObject = {};
                                    if (deviceReadings[key].created_at >= eigthDayDate && deviceReadings[key].created_at <= currentdate) {
                                        if (deviceReadings[key].created_at >= sevenDayDate && deviceReadings[key].created_at <= sixDayDate) {
                                            sevenCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            sevenHourCounter++;
                                        } else if (deviceReadings[key].created_at >= sixDayDate && deviceReadings[key].created_at <= fiveDayDate) {
                                            sixCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            sixHourCounter++;
                                        } else if (deviceReadings[key].created_at >= fiveDayDate && deviceReadings[key].created_at <= fourDayDate) {
                                            fiveCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            fiveHourCounter++;
                                        } else if (deviceReadings[key].created_at >= fourDayDate && deviceReadings[key].created_at <= threeDayDate) {
                                            fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            fourHourCounter++;
                                        } else if (deviceReadings[key].created_at >= threeDayDate && deviceReadings[key].created_at <= twoDayDate) {
                                            threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            threeHourCounter++;
                                        } else if (deviceReadings[key].created_at >= twoDayDate && deviceReadings[key].created_at <= oneDayDate) {
                                            twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            twoHourCounter++;
                                        } else if (deviceReadings[key].created_at >= oneDayDate) {
                                            oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            oneHourCounter++;
                                        }
                                    }
                                }
                                return res.json([
                                    [{
                                            "v": ((sevenCounterReading / sevenHourCounter) > 0) ? Math.round(sevenCounterReading / sevenHourCounter) : 0,
                                            "name": days[new Date(sevenDayDate).getDay()]
                                        }, {
                                            "v": ((sixCounterReading / sixHourCounter) > 0) ? Math.round(sixCounterReading / sixHourCounter) : 0,
                                            "name": days[new Date(sixDayDate).getDay()]
                                        }, {
                                            "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                                            "name": days[new Date(fiveDayDate).getDay()]
                                        }, {
                                            "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                                            "name": days[new Date(fourDayDate).getDay()]
                                        }, {
                                            "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                                            "name": days[new Date(threeDayDate).getDay()]
                                        }, {
                                            "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                                            "name": days[new Date(twoDayDate).getDay()]
                                        }, {
                                            "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                                            "name": days[new Date(oneDayDate).getDay()]
                                        }
                                    ]
                                ]);
                            } else {
                                return res.json([]);
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
            } else if (timeFilter == "month" && type == "history") {
                var refDeviceReading = db.ref("device_reading");
                refDeviceReading.orderByChild('device_id')
                        .equalTo(deviceId)
                        .once("value", function (snapshot) {
                            deviceReadings = snapshot.val();
                            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            var date = new Date();
                            var fiveWeekDate = date.setHours(date.getHours() - 840);
                            var date = new Date();
                            var currentdate = date.setSeconds(date.getSeconds() - 1);
                            var fourCounterReading = 0;
                            var fourHourCounter = 0;
                            var date = new Date();
                            var fourWeekDate = date.setHours(date.getHours() - 672);
                            var threeCounterReading = 0;
                            var threeHourCounter = 0;
                            var date = new Date();
                            var threeWeekDate = date.setHours(date.getHours() - 504);
                            var twoCounterReading = 0;
                            var twoHourCounter = 0;
                            var date = new Date();
                            var twoWeekDate = date.setHours(date.getHours() - 336);
                            var oneCounterReading = 0;
                            var oneHourCounter = 0;
                            var date = new Date();
                            var oneWeekDate = date.setHours(date.getHours() - 168);

                            if (Object.keys(deviceReadings).length && deviceReadings != undefined && deviceReadings != '') {
                                for (key in deviceReadings) {
                                    var readingDataObject = {};

                                    if (deviceReadings[key].created_at >= fiveWeekDate && deviceReadings[key].created_at <= currentdate) {
                                        if (deviceReadings[key].created_at >= fourWeekDate && deviceReadings[key].created_at <= threeWeekDate) {
                                            fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            fourHourCounter++;
                                        } else if (deviceReadings[key].created_at >= threeWeekDate && deviceReadings[key].created_at <= twoWeekDate) {
                                            threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            threeHourCounter++;
                                        } else if (deviceReadings[key].created_at >= twoWeekDate && deviceReadings[key].created_at <= oneWeekDate) {
                                            twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            twoHourCounter++;
                                        } else if (deviceReadings[key].created_at >= oneWeekDate) {
                                            oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                                            oneHourCounter++;
                                        }
                                    }
                                }
                                return res.json([
                                    [{
                                            "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                                            "name": "Week 4",
                                        }, {
                                            "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                                            "name": "Week 3",
                                        }, {
                                            "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                                            "name": "Week 2",
                                        }, {
                                            "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                                            "name": "Week 1",
                                        }
                                    ]
                                ]);
                            } else {
                                return res.json([]);
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
            } else if (timeFilter == "day" && type == "device") {
                return res.json([]);
            } else {
                return res.serverError('invalid paramter');
            }
        } else {
            return res.serverError('parameter missing');
        }
    },

    /*
     * Name: supplierListing
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
    bluetoothDiconnect: function (req, res) {
        if (req.body != undefined && req.body.userId != undefined && req.body.deviceName != undefined) {
            var userDetail = db.ref("users");
            userDetail.orderByChild('id').equalTo(req.body.userId).once("value",
                    function (snapshot) {
                        var ref = db.ref("tokens/" + req.body.userId);
                        ref.once("value", function (snapshot) {
                            var deviceDetail = snapshot.val();
                            if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                                var info = {
                                    userId: snapshot.key,
                                    type: 'bluetooth_disconnect',
                                    title: 'Your device ' + req.body.deviceName + ' is lost bluetooth connectivity.',
                                    body: 'Your  device' + req.body.deviceName + ' is disconnect from mobile/ipad . Please check your device for getting the water level reading.',
                                }
                                for (var key in deviceDetail) {
                                    info.token = deviceDetail[key].device_token;
                                    NotificationService.sendNotification(info);
                                }
                                var ref = db.ref("alert/" + readingKey);
                                var data = {
                                    percentage: 0,
                                    message: info.body,
                                    type: 'bluetooth_disconnect',
                                }
                                ref.push(data).then(function () {
                                });
                                return res.json([]);
                            }

                        });
                    });

        } else {
            return res.serverError('parameter missing');
        }
    },

};
