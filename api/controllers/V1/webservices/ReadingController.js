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
        console.log('Tank Reading Post param-->', req.body);
        if (req.body != undefined && req.body.deviceId != undefined && req.body.timeFilter != undefined && req.body.type != undefined && req.body.userId != undefined && req.body.deviceId != '' && req.body.timeFilter != '' && req.body.type != '' && req.body.userId != '') {
            var deviceId = req.body.deviceId;
            var timeFilter = req.body.timeFilter;
            var type = req.body.type;
            var deviceReadingList = [];
            var timeZoneDifferance = (req.body.timeDifferance != undefined && req.body.timeDifferance != '') ? parseInt(req.body.timeDifferance) : 19800000;
            var timeDifferanceHours  = (timeZoneDifferance /60000);
            var flag = false;
            if (timeFilter == "day" && type == "history") {
                var refDeviceReading = db.ref("device_reading/" + req.body.userId);
                refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
                    deviceReadings = snapshot.val();
                    if (deviceReadings != null && deviceReadings != undefined && Object.keys(deviceReadings).length) {
                        var firstReading = firstCounter = secondReading = secondCounter = thirdReading = thirdCounter = fourthReading = fourthCounter = fifthReading = fifthCounter = sixthReading = sixthCounter = sevenReading = sevenCounter = eigthReading = eigthCounter = nineReading = nineCounter = tenReading = tenCounter = elevenReading = elevenCounter = twelveReading = twelveCounter = 0;
                        var date = new Date();
                        var fromDate = date.setHours(0);
                        var fromDate = date.setMinutes(0);
                        var date = new Date();
                        var toDate = date.setHours(23);
                        var toDate = date.setMinutes(59);

                        var date = new Date();
                        var currentHours = date.getHours();
                        var firstDate = date.setHours(1);
                        var firstDate = date.setMinutes(59);

                        var date = new Date();
                        var secondDate = date.setHours(3);
                        var secondDate = date.setMinutes(59);

                        var date = new Date();
                        var thirdDate = date.setHours(5);
                        var thirdDate = date.setMinutes(59);

                        var date = new Date();
                        var fourthDate = date.setHours(7);
                        var fourthDate = date.setMinutes(59);

                        var date = new Date();
                        var fifthDate = date.setHours(9);
                        var fifthDate = date.setMinutes(59);

                        var date = new Date();
                        var sixthDate = date.setHours(11);
                        var sixthDate = date.setMinutes(59);

                        var date = new Date();
                        var sevenDate = date.setHours(13);
                        var sevenDate = date.setMinutes(59);

                        var date = new Date();
                        var eigthDate = date.setHours(15);
                        var eigthDate = date.setMinutes(59);

                        var date = new Date();
                        var ninthDate = date.setHours(17);
                        var ninthDate = date.setMinutes(59);

                        var date = new Date();
                        var tenthDate = date.setHours(19);
                        var tenthDate = date.setMinutes(59);

                        var date = new Date();
                        var eleventhDate = date.setHours(21);
                        var eleventhDate = date.setMinutes(59);

                        var date = new Date();
                        var twelthDate = date.setHours(23);
                        var twelthDate = date.setMinutes(59);
                        for (key in deviceReadings) {
                            if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at < toDate) {
                                if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at <= firstDate) {
                                    firstReading += parseInt(deviceReadings[key].tank_reading);
                                    firstCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > firstDate && deviceReadings[key].created_at <= secondDate) {
                                    secondReading += parseInt(deviceReadings[key].tank_reading);
                                    secondCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > secondDate && deviceReadings[key].created_at <= thirdDate) {
                                    thirdReading += parseInt(deviceReadings[key].tank_reading);
                                    thirdCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > thirdDate && deviceReadings[key].created_at <= fourthDate) {
                                    fourthReading += parseInt(deviceReadings[key].tank_reading);
                                    fourthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > fourthDate && deviceReadings[key].created_at <= fifthDate) {
                                    fifthReading += parseInt(deviceReadings[key].tank_reading);
                                    fifthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > fifthDate && deviceReadings[key].created_at <= sixthDate) {
                                    sixthReading += parseInt(deviceReadings[key].tank_reading);
                                    sixthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > sixthDate && deviceReadings[key].created_at <= sevenDate) {
                                    sevenReading += parseInt(deviceReadings[key].tank_reading);
                                    sevenCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > sevenDate && deviceReadings[key].created_at <= eigthDate) {
                                    eigthReading += parseInt(deviceReadings[key].tank_reading);
                                    eigthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > eigthDate && deviceReadings[key].created_at <= ninthDate) {
                                    nineReading += parseInt(deviceReadings[key].tank_reading);
                                    nineCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > ninthDate && deviceReadings[key].created_at <= tenthDate) {
                                    tenReading += parseInt(deviceReadings[key].tank_reading);
                                    tenCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > tenthDate && deviceReadings[key].created_at <= eleventhDate) {
                                    elevenReading += parseInt(deviceReadings[key].tank_reading);
                                    elevenCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at > twelthDate) {
                                    twelveReading += parseInt(deviceReadings[key].tank_reading);
                                    twelveCounter++;
                                    flag = true;
                                }
                            }

                        }
                    }
                    if (flag) {
                        return res.json([
                            [
                                {
                                    "v": ((firstReading / firstCounter) > 0) ? Math.round(firstReading / firstCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(firstDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(secondDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(thirdDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(fourthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((fifthReading / fifthCounter) > 0) ? Math.round(fifthReading / fifthCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(fifthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((sixthReading / sixthCounter) > 0) ? Math.round(sixthReading / sixthCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(sixthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((sevenReading / sevenCounter) > 0) ? Math.round(sevenReading / sevenCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(sevenDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((eigthReading / eigthCounter) > 0) ? Math.round(eigthReading / eigthCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(eigthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((nineReading / nineCounter) > 0) ? Math.round(nineReading / nineCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(ninthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((tenReading / tenCounter) > 0) ? Math.round(tenReading / tenCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(tenthDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((elevenReading / elevenCounter) > 0) ? Math.round(elevenReading / elevenCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(eleventhDate + timeZoneDifferance).getUTCHours())
                                },
                                {
                                    "v": ((twelveReading / twelveCounter) > 0) ? Math.round(twelveReading / twelveCounter) : 0,
                                    "name": DateService.getFormatedHour(new Date(twelthDate + timeZoneDifferance).getUTCHours())
                                },
                            ]
                        ]);
                    } else {
                        console.log('aaaa');
                        return res.json([]);
                    }
                }, function (errorObject) {
                    console.log('bbbb');
                    return res.serverError(errorObject.code);
                });
            } else if (timeFilter == "week" && type == "history") {
                var refDeviceReading = db.ref("device_reading/" + req.body.userId);
                refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
                    deviceReadings = snapshot.val();

                    var currentdate = new Date().setMinutes(-1);

                    var today = new Date();
                    today.setHours(-144);
                    firstDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(-120);
                    secondDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(-96);
                    thirdDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(-72);
                    fourthDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(-48);
                    fifthDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(-24);
                    sixthDate = new Date(today.toUTCString());

                    var today = new Date();
                    today.setHours(0);
                    sevenDate = new Date(today.toUTCString());

                    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                    var firstReading = firstCounter = secondReading = secondCounter = thirdReading = thirdCounter = fourthReading = fourthCounter = fifthReading = fifthCounter = sixthReading = sixthCounter = sevenReading = sevenCounter = 0;
                    if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
                        for (key in deviceReadings) {
                            var readingDataObject = {};
                            if (deviceReadings[key].created_at >= firstDate && deviceReadings[key].created_at <= currentdate) {
                                if (deviceReadings[key].created_at >= firstDate && deviceReadings[key].created_at <= secondDate) {
                                    firstReading += parseInt(deviceReadings[key].tank_reading);
                                    firstCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= secondDate && deviceReadings[key].created_at <= thirdDate) {
                                    secondReading += parseInt(deviceReadings[key].tank_reading);
                                    secondCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= thirdDate && deviceReadings[key].created_at <= fourthDate) {
                                    thirdReading += parseInt(deviceReadings[key].tank_reading);
                                    thirdCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= fourthDate && deviceReadings[key].created_at <= fifthDate) {
                                    fourthReading += parseInt(deviceReadings[key].tank_reading);
                                    fourthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= fifthDate && deviceReadings[key].created_at <= sixthDate) {
                                    fifthReading += parseInt(deviceReadings[key].tank_reading);
                                    fifthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= sixthDate && deviceReadings[key].created_at <= sevenDate) {
                                    sixthReading += parseInt(deviceReadings[key].tank_reading);
                                    sixthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= sevenDate) {
                                    sevenReading += parseInt(deviceReadings[key].tank_reading);
                                    sevenCounter++;
                                    flag = true;
                                }
                            }
                        }
                        if (flag) {
                            return res.json([
                                [
                                    {
                                        "v": ((firstReading / firstCounter) > 0) ? Math.round(firstReading / firstCounter) : 0,
                                        "name": days[new Date(firstDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                                        "name": days[new Date(secondDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                                        "name": days[new Date(thirdDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                                        "name": days[new Date(fourthDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((fifthReading / fifthCounter) > 0) ? Math.round(fifthReading / fifthCounter) : 0,
                                        "name": days[new Date(fifthDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((sixthReading / sixthCounter) > 0) ? Math.round(sixthReading / sixthCounter) : 0,
                                        "name": days[new Date(sixthDate + timeZoneDifferance).getDay()]
                                    },
                                    {
                                        "v": ((sevenReading / sevenCounter) > 0) ? Math.round(sevenReading / sevenCounter) : 0,
                                        "name": days[new Date(sevenDate + timeZoneDifferance).getDay()]
                                    }
                                ]
                            ]);
                        } else {
                            console.log('cccccc');
                            return res.json([]);
                        }
                    } else {
                        console.log('dddddd');
                        return res.json([]);
                    }
                }, function (errorObject) {
                    console.log('eeeee');
                    return res.serverError(errorObject.code);
                });
            } else if (timeFilter == "month" && type == "history") {
                var refDeviceReading = db.ref("device_reading/" + req.body.userId);
                refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
                    deviceReadings = snapshot.val();
                    var today = new Date();
                    var getDayNumber = today.getDay();
                    console.log(new Date(today.getFullYear(), today.getMonth(), 0, 1, 0, 0));
                    var startDate = new Date(today.getFullYear(), today.getMonth(), 0, 1, 0, 0).getTime();
                    var startingDate = new Date(today.getFullYear(), today.getMonth(), 0, 1, 0, 0);
                    var lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                    var endDate = new Date(today.getFullYear(), today.getMonth(), lastDay, 59, 59, 59).getTime();
                    var date = new Date();
                    var currentDate = date.getDate();

                    var firstReading = firstCounter = secondReading = secondCounter = thirdReading = thirdCounter = fourthReading = fourthCounter = fiveReading = fiveCounter = 0;

                    var date = new Date(today.getFullYear(), today.getMonth(), 1, 5, 30, 59);
                    if (getDayNumber == 0 && endDate > date.getTime() + (168 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(168);
                    } else if (getDayNumber == 1 && endDate > date.getTime() + (144 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(144);
                    } else if (getDayNumber == 2 && endDate > date.getTime() + (120 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(120);
                    } else if (getDayNumber == 3 && endDate > date.getTime() + (96 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(96);
                    } else if (getDayNumber == 4 && endDate > date.getTime() + (72 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(72);
                    } else if (getDayNumber == 5 && endDate > date.getTime() + (48 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(48);
                    } else if (getDayNumber == 6 && endDate > date.getTime() + (24 * 60 * 60 * 1000)) {
                        var fisrtWeekTime = startingDate.setHours(24);
                    }
                    secondWeekTime = fisrtWeekTime + (168 * 60 * 60 * 1000);
                    thirdWeekTime = secondWeekTime + (168 * 60 * 60 * 1000);
                    fourthWeekTime = thirdWeekTime + (168 * 60 * 60 * 1000);
                    fifthWeekTime = fourthWeekTime + (168 * 60 * 60 * 1000);
                    //console.log(new Date(startDate), new Date(deviceDate), new Date(endDate));
                    if (deviceReadings != undefined && Object.keys(deviceReadings).length && deviceReadings != '') {
                        for (key in deviceReadings) {
                            var readingDataObject = {};
                            if (deviceReadings[key].created_at >= startDate && deviceReadings[key].created_at <= endDate) {
                                if (deviceReadings[key].created_at >= startDate && deviceReadings[key].created_at <= fisrtWeekTime) {
                                    firstReading += parseInt(deviceReadings[key].tank_reading);
                                    firstCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= fisrtWeekTime && deviceReadings[key].created_at <= secondWeekTime) {
                                    secondReading += parseInt(deviceReadings[key].tank_reading);
                                    secondCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= secondWeekTime && deviceReadings[key].created_at <= thirdWeekTime) {
                                    thirdReading += parseInt(deviceReadings[key].tank_reading);
                                    thirdCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= thirdWeekTime && deviceReadings[key].created_at <= fourthWeekTime) {
                                    fourthReading += parseInt(deviceReadings[key].tank_reading);
                                    fourthCounter++;
                                    flag = true;
                                } else if (deviceReadings[key].created_at >= fourthWeekTime && deviceReadings[key].created_at <= fifthWeekTime) {
                                    fiveReading += parseInt(deviceReadings[key].tank_reading);
                                    fiveCounter++;
                                    flag = true;
                                }
                            }
                        }
                        if (flag) {
                            return res.json([
                                [{
                                    "v": ((firstReading / firstCounter) > 0) ? Math.round(firstReading / firstCounter) : 0,
                                    "name": "Week 1",
                                },
                                    {
                                        "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                                        "name": "Week 2",
                                    },
                                    {
                                        "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                                        "name": "Week 3",
                                    },
                                    {
                                        "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                                        "name": "Week 4",
                                    },
                                    {
                                        "v": ((fiveReading / fiveCounter) > 0) ? Math.round(fiveReading / fiveCounter) : 0,
                                        "name": "Week 5",
                                    },
                                ]
                            ]);
                        } else {
                            console.log('fffffff');
                            return res.json([]);
                        }
                    } else {
                        console.log('gggggg');
                        return res.json([]);
                    }


                    /*var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
                    if (deviceReadings != undefined && Object.keys(deviceReadings).length && deviceReadings != '') {
                      for (key in deviceReadings) {
                        var readingDataObject = {};

                        if (deviceReadings[key].created_at >= fiveWeekDate && deviceReadings[key].created_at <= currentdate) {
                          if (deviceReadings[key].created_at >= fourWeekDate && deviceReadings[key].created_at <= threeWeekDate) {
                            fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                            fourHourCounter++;
                            flag = true;
                          } else if (deviceReadings[key].created_at >= threeWeekDate && deviceReadings[key].created_at <= twoWeekDate) {
                            threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                            threeHourCounter++;
                            flag = true;
                          } else if (deviceReadings[key].created_at >= twoWeekDate && deviceReadings[key].created_at <= oneWeekDate) {
                            twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                            twoHourCounter++;
                            flag = true;
                          } else if (deviceReadings[key].created_at >= oneWeekDate) {
                            oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                            oneHourCounter++;
                            flag = true;
                          }
                        }
                      }
                      if (flag) {
                        return res.json([
                          [{
                            "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                            "name": "Week 1",
                          },
                            {
                              "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                              "name": "Week 2",
                            },
                            {
                              "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                              "name": "Week 3",
                            },
                            {
                              "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                              "name": "Week 4",
                            },
                          ]
                        ]);
                      } else {
                        return res.json([]);
                      }
                    } else {
                      return res.json([]);
                    }*/
                }, function (errorObject) {
                    console.log('hhhhhhhh');
                    return res.serverError(errorObject.code);
                });
            } else if (timeFilter == "day" && type == "device") {
                if (req.body.date != undefined) {
                    var refDeviceReading = db.ref("device_reading/" + req.body.userId);
                    refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
                        deviceReadings = snapshot.val();
                        if (deviceReadings != null && deviceReadings != undefined && Object.keys(deviceReadings).length) {
                            var firstReading = firstCounter = secondReading = secondCounter = thirdReading = thirdCounter = fourthReading = fourthCounter = fifthReading = fifthCounter = sixthReading = sixthCounter = sevenReading = sevenCounter = eigthReading = eigthCounter = nineReading = nineCounter = tenReading = tenCounter = elevenReading = elevenCounter = twelveReading = twelveCounter = 0;
                            var date = new Date(req.body.date);
                            var fromDate = date.setHours(0);
                            var fromDate = date.setMinutes(0);
                            var date = new Date(req.body.date);
                            var toDate = date.setHours(23);
                            var toDate = date.setMinutes(59);

                            var date = new Date();
                            var firstDate = date.setHours(2);
                            var firstDate = date.setMinutes(0);

                            var date = new Date();
                            var secondDate = date.setHours(4);
                            var secondDate = date.setMinutes(0);

                            var date = new Date();
                            var thirdDate = date.setHours(6);
                            var thirdDate = date.setMinutes(0);

                            var date = new Date();
                            var fourthDate = date.setHours(8);
                            var fourthDate = date.setMinutes(0);

                            var date = new Date();
                            var fifthDate = date.setHours(10);
                            var fifthDate = date.setMinutes(0);

                            var date = new Date();
                            var sixthDate = date.setHours(12);
                            var sixthDate = date.setMinutes(0);

                            var date = new Date();
                            var sevenDate = date.setHours(14);
                            var sevenDate = date.setMinutes(0);

                            var date = new Date();
                            var eigthDate = date.setHours(16);
                            var eigthDate = date.setMinutes(0);

                            var date = new Date();
                            var ninthDate = date.setHours(18);
                            var ninthDate = date.setMinutes(0);

                            var date = new Date();
                            var tenthDate = date.setHours(20);
                            var tenthDate = date.setMinutes(0);

                            var date = new Date();
                            var eleventhDate = date.setHours(22);
                            var eleventhDate = date.setMinutes(0);

                            var date = new Date();
                            var twelthDate = date.setHours(23);
                            var twelthDate = date.setMinutes(59);

                            for (key in deviceReadings) {
                                if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at < toDate) {
                                    if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at <= firstDate) {
                                        firstReading += parseInt(deviceReadings[key].tank_reading);
                                        firstCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > firstDate && deviceReadings[key].created_at <= secondDate) {
                                        secondReading += parseInt(deviceReadings[key].tank_reading);
                                        secondCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > secondDate && deviceReadings[key].created_at <= thirdDate) {
                                        thirdReading += parseInt(deviceReadings[key].tank_reading);
                                        thirdCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > thirdDate && deviceReadings[key].created_at <= fourthDate) {
                                        fourthReading += parseInt(deviceReadings[key].tank_reading);
                                        fourthCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > fourthDate && deviceReadings[key].created_at <= fifthDate) {
                                        fifthReading += parseInt(deviceReadings[key].tank_reading);
                                        fifthCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > fifthDate && deviceReadings[key].created_at <= sixthDate) {
                                        sixthReading += parseInt(deviceReadings[key].tank_reading);
                                        sixthCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > sixthDate && deviceReadings[key].created_at <= sevenDate) {
                                        sevenReading += parseInt(deviceReadings[key].tank_reading);
                                        sevenCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > sevenDate && deviceReadings[key].created_at <= eigthDate) {
                                        eigthReading += parseInt(deviceReadings[key].tank_reading);
                                        eigthCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > eigthDate && deviceReadings[key].created_at <= ninthDate) {
                                        nineReading += parseInt(deviceReadings[key].tank_reading);
                                        nineCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > ninthDate && deviceReadings[key].created_at <= tenthDate) {
                                        tenReading += parseInt(deviceReadings[key].tank_reading);
                                        tenCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > tenthDate && deviceReadings[key].created_at <= eleventhDate) {
                                        elevenReading += parseInt(deviceReadings[key].tank_reading);
                                        elevenCounter++;
                                        flag = true;
                                    } else if (deviceReadings[key].created_at > twelthDate) {
                                        twelveReading += parseInt(deviceReadings[key].tank_reading);
                                        twelveCounter++;
                                        flag = true;
                                    }
                                }
                            }
                        }
                        if (flag) {
                            return res.json([
                                [
                                    {
                                        "v": ((firstReading / firstCounter) > 0) ? Math.round(firstReading / firstCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(firstDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(secondDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(thirdDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(fourthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((fifthReading / fifthCounter) > 0) ? Math.round(fifthReading / fifthCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(fifthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((sixthReading / sixthCounter) > 0) ? Math.round(sixthReading / sixthCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(sixthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((sevenReading / sevenCounter) > 0) ? Math.round(sevenReading / sevenCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(sevenDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((eigthReading / eigthCounter) > 0) ? Math.round(eigthReading / eigthCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(eigthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((nineReading / nineCounter) > 0) ? Math.round(nineReading / nineCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(ninthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((tenReading / tenCounter) > 0) ? Math.round(tenReading / tenCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(tenthDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((elevenReading / elevenCounter) > 0) ? Math.round(elevenReading / elevenCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(eleventhDate + timeZoneDifferance).getUTCHours())
                                    },
                                    {
                                        "v": ((twelveReading / twelveCounter) > 0) ? Math.round(twelveReading / twelveCounter) : 0,
                                        "name": DateService.getFormatedHour(new Date(twelthDate + timeZoneDifferance).getUTCHours())
                                    },
                                ]
                            ]);
                        } else {
                            console.log('ffff');
                            return res.json([]);
                        }
                    }, function (errorObject) {
                        console.log('gggg');
                        return res.serverError(errorObject.code);
                    });
                } else {
                    console.log('hhhh');
                    return res.serverError('parameter missing');
                }
            } else {
                console.log('iiii');
                return res.serverError('invalid paramter');
            }
        } else {
            console.log('jjjjj');
            return res.serverError('parameter missing');
        }
    },


    /*
       * Name: sendNotificationCronJob
       * Created By: A-SIPL
       * Created Date: 01-feb-2018
       * Purpose: sent notification using cron job
       * @param  req
       */
    sendNotificationCronJob: function (req, res) {
        console.log('Cron is runnig for reminder...');
        var currentDate = Date.now();
        var currentDateObj = new Date();
        var loopCount = 0;
        var ref = db.ref("devices");
        ref.once("value", function (snapshotWards) {
            var counteNumber = snapshotWards.numChildren();
            console.log('111');

            _.map(snapshotWards.val(), function (val, user_key) {
                loopCount++;
                console.log('222');
                _.map(val, function (val2, device_key) {
                    console.log('333');
                    if (val2.tank_status != undefined && val2.settings != undefined && val2.settings.from_date != undefined) {
                        console.log('444');
                        var fromDate = new Date(val2.settings.from_date);
                        console.log('in if condition', val2);
                        console.log(currentDateObj.getTime(), fromDate.getTime());
                        var lastNotificationSendMinutesAgo = Math.floor((currentDate - val2.settings.last_notification_time) / 1000);
                        if (val2 != undefined && val2 != null && Object.keys(val2).length && currentDateObj.getTime() > fromDate.getTime() && val2.settings.repeat == true && val2.tank_status.percentage <= parseFloat(val2.settings.alert_level_change) && val2.settings.repeat_duration != undefined &&  lastNotificationSendMinutesAgo >= val2.settings.repeat_duration) {
                            // Already working code with pass user_key.
                            var ref = db.ref("users");
                            ref.orderByChild("id").equalTo(user_key).once("child_added",
                                function (snapshot) {
                                    console.log('666');
                                    var userInfo = snapshot.val();
                                    //console.log('User infor...', userInfo);
                                    if (userInfo != undefined && userInfo != null) {
                                        console.log('7777');
                                        var userKey = snapshot.key;
                                        if (userInfo.is_user_notification != undefined && userInfo.is_user_notification == true) {
                                            console.log('888');
                                            var ref = db.ref("tokens/" + user_key);
                                            ref.once("value", function (snapshot) {
                                                console.log('999');
                                                var deviceDetail = snapshot.val();
                                                if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                                                    console.log('aaa');
                                                    //console.log('true111...');
                                                    var info = {
                                                        userId: user_key,
                                                        type: 'update_device_setting',
                                                        title: 'Your tank ' + val2.device_name + ' is at minimum level (' + val2.tank_status.percentage + '%).',
                                                        body: 'Your tank ' + val2.device_name + ' is at minimum level (' + val2.tank_status.percentage + '%). Please contact to supplier for filling tank',
                                                        data: {}
                                                    }
                                                    for (var key in deviceDetail) {
                                                        console.log('bbb');
                                                        info.token = deviceDetail[key].device_token;
                                                        console.log('Notification--->', info);
                                                        NotificationService.sendNotification(info);
                                                    }
                                                    console.log('ccc');
                                                    db.ref('devices/' + user_key + '/' + device_key + '/settings')
                                                        .update({
                                                            'last_notification_time': Date.now()
                                                        }).then(function (res) {
                                                        console.log('ddd');
                                                    }, function (errorObject) {
                                                        console.log('eee');
                                                        return res.json([]);
                                                    })
                                                    var ref = db.ref("alerts/" + user_key);
                                                    var data = {
                                                        percentage: 0,
                                                        message: info.body,
                                                        type: 'update_device_setting',
                                                    }
                                                    ref.push(data).then(function () {
                                                        console.log('fff');
                                                        return res.json([]);
                                                    }, function (errorObject) {
                                                        console.log('llll', errorObject);
                                                        return res.json([]);
                                                    });
                                                }
                                            }, function (errorObject) {
                                                console.log('nnnn', errorObject);
                                                return res.json([]);
                                            });
                                        }
                                    }
                                }, function (errorObject) {
                                    console.log('qqqq', errorObject);
                                    return res.json([]);
                                });
                        }
                    }
                }, function(err){
                    console.log('805', err);
                });
            }, function(err){
                console.log('herer', err);
            });
            if(loopCount == counteNumber){
                console.log("there is not record for send device token");
                return res.json([]);
            }
        }, function (errorObject) {
            console.log('rrrr', errorObject);
            return res.serverError(errorObject.code);
        });
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
                    var userInfo = snapshot.val();
                    if (userInfo != undefined && userInfo != '') {
                        var userKey = (Object.keys(userInfo)[0]) ? Object.keys(userInfo)[0] : 0;
                        if (userInfo[userKey].is_user_notification != undefined && userInfo[userKey].is_user_notification == true) {
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
                                    var ref = db.ref("alerts/" + req.body.userId);
                                    var data = {
                                        percentage: 0,
                                        message: info.body,
                                        type: 'bluetooth_disconnect',
                                    }
                                    ref.push(data).then(function () {
                                    }, function (errorObject) {
                                        console.log('ssss', errorObject);
                                        return res.serverError(errorObject.code);
                                    });
                                    return res.json([]);
                                } else {
                                    console.log('pppppp');
                                    return res.json([]);
                                }

                            }, function (errorObject) {
                                console.log('tttt');
                                return res.serverError(errorObject.code);
                            });
                        } else {
                            console.log('aaaaa');
                            return res.json([]);
                        }
                    } else {
                        return res.json([]);
                    }

                }, function (errorObject) {
                    console.log('uuuuuuuuu', errorObject);
                    return res.json([]);
                });

        } else {
            return res.serverError('parameter missing');
        }
    },

    /*
       * Name: updateDeviceSettingData
       * Created By: A-SIPL
       * Created Date: 16-jan-2018
       * Purpose: update the device data of other device by push notification
       * @param  req
       */
    updateDeviceSettingData: function (req, res) {
        console.log('Update device setting param-->', req.body);
        if (req.body != undefined && req.body.userId != undefined && req.body.deviceId != undefined && req.body.title != undefined && req.body.fromDate != undefined && req.body.toDate != undefined && req.body.intervalMinute != undefined && req.body.repeatDuration != undefined && req.body.alertLevel != undefined) {
            var userDetail = db.ref("users");
            userDetail.orderByChild('id').equalTo(req.body.userId).once("value",
                function (snapshot) {
                    var userInfo = snapshot.val();
                    if (userInfo != undefined && userInfo != '') {
                        var userKey = (Object.keys(userInfo)[0]) ? Object.keys(userInfo)[0] : 0;
                        if (userInfo[userKey].is_user_notification != undefined && userInfo[userKey].is_user_notification == true) {
                            var ref = db.ref("tokens/" + req.body.userId);
                            ref.once("value", function (snapshot) {
                                var deviceDetail = snapshot.val();
                                if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                                    console.log('true111...');
                                    var info = {
                                        userId: snapshot.key,
                                        type: 'update_device_setting',
                                        title: 'Your device ' + req.body.deviceName + ' setting updated.',
                                        body: 'Your  device' + req.body.deviceName + ' setting is updated by you.',
                                        data: {
                                            title: req.body.title,
                                            fromDate: req.body.fromDate,
                                            toDate: req.body.toDate,
                                            intervalInMinute: req.body.intervalInMinute,
                                            repeatDuration: req.body.repeatDuration,
                                            alertLevel: req.body.alertLevel,
                                        }
                                    }
                                    for (var key in deviceDetail) {
                                        info.token = deviceDetail[key].device_token;
                                        NotificationService.sendNotification(info);
                                    }
                                    var ref = db.ref("alerts/" + req.body.userId);
                                    var data = {
                                        percentage: 0,
                                        message: info.body,
                                        type: 'update_device_setting',
                                    }
                                    ref.push(data).then(function () {
                                    }, function (errorObject) {
                                        console.log('vvvv', errorObject);
                                        return res.serverError(errorObject.code);
                                    });
                                    return res.json([]);
                                } else {
                                    console.log('false111...');
                                    return res.json([]);
                                }

                            }, function (errorObject) {
                                console.log('wwww');
                                return res.serverError(errorObject.code);
                            });
                        } else {
                            return res.json([]);
                        }
                    } else {
                        return res.json([]);
                    }

                }, function (errorObject) {
                    console.log('xxxx');
                    return res.serverError(errorObject.code);
                });
        } else {
            console.log('yyyy');
            return res.serverError('parameter missing');
        }
    },

    /*
       * Name: readingNotification
       * Created By: A-SIPL
       * Created Date: 8-dec-2017
       * Purpose: add new supplier
       * @param  req
       */
    readingNotification: function (req, res) {
        console.log('Device reading param param-->', req.body);
        if (req.body != undefined && req.body.alertLevel != undefined && req.body.deviceBatteryLevel != undefined && req.body.deviceId != undefined && req.body.deviceName != undefined && req.body.intervalInMinutes != undefined && req.body.mobileBatteryLevel != undefined && req.body.tankHeight != undefined && req.body.tankReading != undefined && req.body.userId != undefined) {
            var userDetail = db.ref("users");
            userDetail.orderByChild('id').equalTo(req.body.userId).once("child_added",
                function (snapshot) {
                    var userInfo = snapshot.val();
                    if (userInfo != undefined && userInfo != null) {
                        var userKey = snapshot.key ? snapshot.key : 0;
                        if (userInfo.is_user_notification != undefined && userInfo.is_user_notification == true) {
                            var ref = db.ref("tokens/" + req.body.userId);
                            ref.once("value", function (snapshot) {
                                var deviceDetail = snapshot.val();
                                if (deviceDetail != undefined && Object.keys(deviceDetail).length) {
                                    if (req.body.mobileBatteryLevel < sails.config.min_battery_level) {
                                        var info = {
                                            userId: req.body.userId,
                                            type: 'low_mobile_battery',
                                            title: 'Mobile battery is low',
                                            body: 'Your  ' + req.body.deviceName + ' mobile/ipad battery at minimum level. Please charge your mobile.',
                                        }
                                        for (var key in deviceDetail) {
                                            info.token = deviceDetail[key].device_token;
                                            NotificationService.sendNotification(info);
                                        }
                                        var ref = db.ref("alerts/" + req.body.userId);
                                        var data = {
                                            percentage: 0,
                                            message: info.body,
                                            type: 'low_mobile_battery',
                                        }
                                        ref.push(data).then(function () {
                                        }, function (errorObject) {
                                            return res.json([]);
                                        });
                                    }
                                    if (req.body.mobileBatteryLevel < sails.config.min_device_battery_level) {
                                        var info = {
                                            userId: req.body.userId,
                                            type: 'low_device_battery',
                                            title: 'Device battery is low',
                                            body: 'Your device battery at minimum level. Charge ' + req.body.mobileBatteryLevel + '% device battery',
                                        }
                                        for (var key in deviceDetail) {
                                            info.token = deviceDetail[key].device_token;
                                            NotificationService.sendNotification(info);
                                        }
                                        var ref = db.ref("alerts/" + req.body.userId);
                                        var data = {
                                            percentage: 0,
                                            message: info.body,
                                            type: 'low_device_battery',
                                        }
                                        ref.push(data).then(function () {
                                        }, function (errorObject) {
                                            return res.json([]);
                                        });
                                    }
                                    if (req.body.alertLevel > req.body.tankReading) {
                                        var info = {
                                            userId: req.body.userId,
                                            type: 'low_tank_level',
                                            title: req.body.deviceName + ' is content only ' + req.body.tankReading + '% water level',
                                            body: 'Your tank ' + req.body.deviceName + ' is content only ' + req.body.tankReading + '% water. Please fill the tank as soon as posible',
                                        }
                                        for (var key in deviceDetail) {
                                            info.token = deviceDetail[key].device_token;
                                            NotificationService.sendNotification(info);
                                        }
                                        var ref = db.ref("alerts/" + req.body.userId);
                                        var data = {
                                            percentage: req.body.tankReading,
                                            message: info.body,
                                            type: 'low_tank_level',
                                        }
                                        ref.push(data).then(function () {
                                        }, function (errorObject) {
                                            return res.json([]);
                                        });
                                    }
                                }
                            }, function (errorObject1) {
                                return res.json([]);
                            });
                        } else {
                            return res.json([]);
                        }
                    } else {
                        return res.json([]);
                    }
                }, function (errorObject) {
                    return res.json([]);
                });
        } else {
            return res.json([]);
        }
    },

};
