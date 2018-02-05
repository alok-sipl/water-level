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
    if (req.body != undefined && req.body.deviceId != undefined && req.body.timeFilter != undefined && req.body.type != undefined && req.body.userId != undefined && req.body.deviceId != '' && req.body.timeFilter != '' && req.body.type != '' && req.body.userId != '') {
      var deviceId = req.body.deviceId;
      var timeFilter = req.body.timeFilter;
      var type = req.body.type;
      var deviceReadingList = [];
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
                  console.log('firstCounter', firstCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > firstDate && deviceReadings[key].created_at <= secondDate) {
                  secondReading += parseInt(deviceReadings[key].tank_reading);
                  secondCounter++;
                  console.log('secondCounter', secondCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > secondDate && deviceReadings[key].created_at <= thirdDate) {
                  thirdReading += parseInt(deviceReadings[key].tank_reading);
                  thirdCounter++;
                  console.log('thirdCounter', thirdCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > thirdDate && deviceReadings[key].created_at <= fourthDate) {
                  fourthReading += parseInt(deviceReadings[key].tank_reading);
                  fourthCounter++;
                  console.log('fourthCounter', fourthCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > fourthDate && deviceReadings[key].created_at <= fifthDate) {
                  fifthReading += parseInt(deviceReadings[key].tank_reading);
                  fifthCounter++;
                  console.log('fifthCounter', fifthCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > fifthDate && deviceReadings[key].created_at <= sixthDate) {
                  sixthReading += parseInt(deviceReadings[key].tank_reading);
                  sixthCounter++;
                  console.log('sixthCounter', sixthCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > sixthDate && deviceReadings[key].created_at <= sevenDate) {
                  sevenReading += parseInt(deviceReadings[key].tank_reading);
                  sevenCounter++;
                  console.log('sevenCounter', sevenCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > sevenDate && deviceReadings[key].created_at <= eigthDate) {
                  eigthReading += parseInt(deviceReadings[key].tank_reading);
                  eigthCounter++;
                  console.log('eigthCounter', eigthCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > eigthDate && deviceReadings[key].created_at <= ninthDate) {
                  nineReading += parseInt(deviceReadings[key].tank_reading);
                  nineCounter++;
                  console.log('nineCounter', nineCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > ninthDate && deviceReadings[key].created_at <= tenthDate) {
                  tenReading += parseInt(deviceReadings[key].tank_reading);
                  tenCounter++;
                  console.log('tenCounter', tenCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > tenthDate && deviceReadings[key].created_at <= eleventhDate) {
                  elevenReading += parseInt(deviceReadings[key].tank_reading);
                  elevenCounter++;
                  console.log('elevenCounter', elevenCounter);
                  flag = true;
                } else if (deviceReadings[key].created_at > twelthDate) {
                  twelveReading += parseInt(deviceReadings[key].tank_reading);
                  twelveCounter++;
                  console.log('twelveCounter', twelveCounter);
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
                  "name": DateService.getFormatedHour(new Date(firstDate + 19800000).getUTCHours())
                },
                {
                  "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(secondDate + 19800000).getUTCHours())
                },
                {
                  "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(thirdDate + 19800000).getUTCHours())
                },
                {
                  "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(fourthDate + 19800000).getUTCHours())
                },
                {
                  "v": ((fifthReading / fifthCounter) > 0) ? Math.round(fifthReading / fifthCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(fifthDate + 19800000).getUTCHours())
                },
                {
                  "v": ((sixthReading / sixthCounter) > 0) ? Math.round(sixthReading / sixthCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(sixthDate + 19800000).getUTCHours())
                },
                {
                  "v": ((sevenReading / sevenCounter) > 0) ? Math.round(sevenReading / sevenCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(sevenDate + 19800000).getUTCHours())
                },
                {
                  "v": ((eigthReading / eigthCounter) > 0) ? Math.round(eigthReading / eigthCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(firstDate + 19800000).getUTCHours())
                },
                {
                  "v": ((nineReading / nineCounter) > 0) ? Math.round(nineReading / nineCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(ninthDate + 19800000).getUTCHours())
                },
                {
                  "v": ((tenReading / tenCounter) > 0) ? Math.round(tenReading / tenCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(tenthDate + 19800000).getUTCHours())
                },
                {
                  "v": ((elevenReading / elevenCounter) > 0) ? Math.round(elevenReading / elevenCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(eleventhDate + 19800000).getUTCHours())
                },
                {
                  "v": ((twelveReading / twelveCounter) > 0) ? Math.round(twelveReading / twelveCounter) : 0,
                  "name": DateService.getFormatedHour(new Date(twelthDate + 19860000).getUTCHours())
                },
              ]
            ]);
          } else {
            return res.json([]);
          }


          /*var date = new Date();
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
                  flag = true;
                } else if (deviceReadings[key].created_at >= fourHourDate && deviceReadings[key].created_at <= threeHourDate) {
                  fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                  fourHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= threeHourDate && deviceReadings[key].created_at <= twoHourDate) {
                  threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                  threeHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= twoHourDate && deviceReadings[key].created_at <= oneHourDate) {
                  twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                  twoHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= oneHourDate) {
                  oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                  oneHourCounter++;
                  flag = true;
                }
              }
            }
            //console.log('fiveHourCounter', fiveHourCounter);
            //console.log('fourHourCounter', fourHourCounter);
            //console.log('threeHourCounter', threeHourCounter);
            //console.log('twoHourCounter', twoHourCounter);
            //console.log('oneHourCounter', oneHourCounter);
            if (flag) {
              return res.json([
                [
                  {
                    "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(oneHourDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(twoHourDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(threeHourDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(fourHourDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(fiveHourDate + 19800000).getUTCHours())
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
          return res.serverError(errorObject.code);
        });
      } else if (timeFilter == "week" && type == "history") {
        var refDeviceReading = db.ref("device_reading/" + req.body.userId);
        refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
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
          var oneDayDate = date.setHours(date.getHours() - 24);
          if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
            for (key in deviceReadings) {
              var readingDataObject = {};
              if (deviceReadings[key].created_at >= eigthDayDate && deviceReadings[key].created_at <= currentdate) {
                if (deviceReadings[key].created_at >= sevenDayDate && deviceReadings[key].created_at <= sixDayDate) {
                  sevenCounterReading += parseInt(deviceReadings[key].tank_reading);
                  sevenHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= sixDayDate && deviceReadings[key].created_at <= fiveDayDate) {
                  sixCounterReading += parseInt(deviceReadings[key].tank_reading);
                  sixHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= fiveDayDate && deviceReadings[key].created_at <= fourDayDate) {
                  fiveCounterReading += parseInt(deviceReadings[key].tank_reading);
                  fiveHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= fourDayDate && deviceReadings[key].created_at <= threeDayDate) {
                  fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                  fourHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= threeDayDate && deviceReadings[key].created_at <= twoDayDate) {
                  threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                  threeHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= twoDayDate && deviceReadings[key].created_at <= oneDayDate) {
                  twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                  twoHourCounter++;
                  flag = true;
                } else if (deviceReadings[key].created_at >= oneDayDate) {
                  oneCounterReading += parseInt(deviceReadings[key].tank_reading);
                  oneHourCounter++;
                  flag = true;
                }
              }
            }
            if (flag) {
              return res.json([
                [
                  {
                    "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                    "name": days[new Date(oneDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                    "name": days[new Date(twoDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                    "name": days[new Date(threeDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                    "name": days[new Date(fourDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                    "name": days[new Date(fiveDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((sixCounterReading / sixHourCounter) > 0) ? Math.round(sixCounterReading / sixHourCounter) : 0,
                    "name": days[new Date(sixDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((sixCounterReading / sixHourCounter) > 0) ? Math.round(sixCounterReading / sixHourCounter) : 0,
                    "name": days[new Date(sixDayDate + 19800000).getDay()]
                  },
                  {
                    "v": ((sevenCounterReading / sevenHourCounter) > 0) ? Math.round(sevenCounterReading / sevenHourCounter) : 0,
                    "name": days[new Date(sevenDayDate + 19800000).getDay()]
                  },
                ]
              ]);
            } else {
              return res.json([]);
            }
          } else {
            return res.json([]);
          }
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else if (timeFilter == "month" && type == "history") {
        var refDeviceReading = db.ref("device_reading/" + req.body.userId);
        refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
          deviceReadings = snapshot.val();
          var today = new Date();
          var getDayNumber = today.getDay();
          var startDate = new Date(today.getFullYear(), today.getMonth(), 0, 1, 0, 0).getTime();
          var lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          var endDate = new Date(today.getFullYear(), today.getMonth(), lastDay, 59, 59, 59).getTime();
          var date = new Date();
          var currentDate = date.getDate();

          var firstReading = firstCounter = secondReading = secondCounter = thirdReading = thirdCounter = fourthReading = fourthCounter = fiveReading = fiveCounter = 0;
          console.log(getDayNumber, '-----------', endDate, date.setHours(date.getHours() + 168));
          if (getDayNumber == 0 && endDate > date.setHours(date.getHours() + 168)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 168);
          } else if (getDayNumber == 1 && endDate > date.setHours(date.getHours() + 144)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 144);
          } else if (getDayNumber == 2 && endDate > date.setHours(date.getHours() + 120)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 120);
          } else if (getDayNumber == 3 && endDate > date.setHours(date.getHours() + 96)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 96);
          } else if (getDayNumber == 4 && endDate > date.setHours(date.getHours() + 72)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 72);
          } else if (getDayNumber == 5 && endDate > date.setHours(date.getHours() + 48)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 48);
          } else if (getDayNumber == 6 && endDate > date.setHours(date.getHours() + 24)) {
            var fisrtWeekTime = date.setHours(date.getHours() + 24);
          }
          secondWeekTime = fisrtWeekTime + (168 * 60 * 60 * 1000);
          thirdWeekTime = secondWeekTime + (168 * 60 * 60 * 1000);
          fourthWeekTime = thirdWeekTime + (168 * 60 * 60 * 1000);
          fifthWeekTime = fourthWeekTime + (168 * 60 * 60 * 1000);
          if (deviceReadings != undefined && Object.keys(deviceReadings).length && deviceReadings != '') {
            console.log(startDate, '-----------', fisrtWeekTime);
            for (key in deviceReadings) {
              var readingDataObject = {};
              if (deviceReadings[key].created_at >= startDate && deviceReadings[key].created_at <= endDate) {
                //console.log(deviceReadings[key]);
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
              return res.json([]);
            }
          } else {
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
              var currentHours = date.getHours();
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

              console.log(new Date(fromDate), new Date(toDate));
              for (key in deviceReadings) {
                console.log(new Date(deviceReadings[key].created_at));
                if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at < toDate) {

                  if (deviceReadings[key].created_at > fromDate && deviceReadings[key].created_at <= firstDate) {
                    firstReading += parseInt(deviceReadings[key].tank_reading);
                    firstCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at > firstDate && deviceReadings[key].created_at <= secondDate) {
                    secondReading += parseInt(deviceReadings[key].tank_reading);
                    secondCounter++;
                    console.log('secondCounter', secondCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > secondDate && deviceReadings[key].created_at <= thirdDate) {
                    thirdReading += parseInt(deviceReadings[key].tank_reading);
                    thirdCounter++;
                    console.log('thirdCounter', thirdCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > thirdDate && deviceReadings[key].created_at <= fourthDate) {
                    fourthReading += parseInt(deviceReadings[key].tank_reading);
                    fourthCounter++;
                    console.log('fourthCounter', fourthCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > fourthDate && deviceReadings[key].created_at <= fifthDate) {
                    fifthReading += parseInt(deviceReadings[key].tank_reading);
                    fifthCounter++;
                    console.log('fifthCounter', fifthCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > fifthDate && deviceReadings[key].created_at <= sixthDate) {
                    sixthReading += parseInt(deviceReadings[key].tank_reading);
                    sixthCounter++;
                    console.log('sixthCounter', sixthCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > sixthDate && deviceReadings[key].created_at <= sevenDate) {
                    sevenReading += parseInt(deviceReadings[key].tank_reading);
                    sevenCounter++;
                    console.log('sevenCounter', sevenCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > sevenDate && deviceReadings[key].created_at <= eigthDate) {
                    eigthReading += parseInt(deviceReadings[key].tank_reading);
                    eigthCounter++;
                    console.log('eigthCounter', eigthCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > eigthDate && deviceReadings[key].created_at <= ninthDate) {
                    nineReading += parseInt(deviceReadings[key].tank_reading);
                    nineCounter++;
                    console.log('nineCounter', nineCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > ninthDate && deviceReadings[key].created_at <= tenthDate) {
                    tenReading += parseInt(deviceReadings[key].tank_reading);
                    tenCounter++;
                    console.log('tenCounter', tenCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > tenthDate && deviceReadings[key].created_at <= eleventhDate) {
                    elevenReading += parseInt(deviceReadings[key].tank_reading);
                    elevenCounter++;
                    console.log('elevenCounter', elevenCounter);
                    flag = true;
                  } else if (deviceReadings[key].created_at > twelthDate) {
                    twelveReading += parseInt(deviceReadings[key].tank_reading);
                    twelveCounter++;
                    console.log('twelveCounter', twelveCounter);
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
                    "name": DateService.getFormatedHour(new Date(firstDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((secondReading / secondCounter) > 0) ? Math.round(secondReading / secondCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(secondDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((thirdReading / thirdCounter) > 0) ? Math.round(thirdReading / thirdCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(thirdDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((fourthReading / fourthCounter) > 0) ? Math.round(fourthReading / fourthCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(fourthDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((fifthReading / fifthCounter) > 0) ? Math.round(fifthReading / fifthCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(fifthDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((sixthReading / sixthCounter) > 0) ? Math.round(sixthReading / sixthCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(sixthDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((sevenReading / sevenCounter) > 0) ? Math.round(sevenReading / sevenCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(sevenDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((eigthReading / eigthCounter) > 0) ? Math.round(eigthReading / eigthCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(firstDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((nineReading / nineCounter) > 0) ? Math.round(nineReading / nineCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(ninthDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((tenReading / tenCounter) > 0) ? Math.round(tenReading / tenCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(tenthDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((elevenReading / elevenCounter) > 0) ? Math.round(elevenReading / elevenCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(eleventhDate + 19800000).getUTCHours())
                  },
                  {
                    "v": ((twelveReading / twelveCounter) > 0) ? Math.round(twelveReading / twelveCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(twelthDate + 19860000).getUTCHours())
                  },
                ]
              ]);
            } else {
              return res.json([]);
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });


          /*var startTime = new Date(req.body.date).getTime();
          var endTime = startTime + 86400000;
          //console.log('URL--->', "device_reading/" + req.body.userId);
          var refDeviceReading = db.ref("device_reading/" + req.body.userId);
          refDeviceReading.orderByChild('device_id').equalTo(req.body.deviceId).once("value", function (snapshot) {
            deviceReadings = snapshot.val();
            //console.log('Reading-->', deviceReadings);
            var sixthDate = endTime;
            var fiveCounterReading = 0;
            var fiveHourCounter = 0;
            var fifthDate = startTime + 72000000;
            var fourCounterReading = 0;
            var fourHourCounter = 0;
            var fourthDate = startTime + 57600000;
            var threeCounterReading = 0;
            var threeHourCounter = 0;
            var thirdDate = startTime + 43200000;
            var twoCounterReading = 0;
            var twoHourCounter = 0;
            var secondDate = startTime + 28800000;
            var oneCounterReading = 0;
            var oneHourCounter = 0;
            var firstDate = startTime + 14400000;
            if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
              for (key in deviceReadings) {
                var readingDataObject = {};
                if (deviceReadings[key].created_at >= startTime && deviceReadings[key].created_at <= endTime) {
                  if (deviceReadings[key].created_at >= sixthDate && deviceReadings[key].created_at <= fifthDate) {
                    fiveCounterReading += parseInt(deviceReadings[key].tank_reading);
                    fiveHourCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at >= fifthDate && deviceReadings[key].created_at <= fourthDate) {
                    fiveCounterReading += parseInt(deviceReadings[key].tank_reading);
                    fiveHourCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at >= fourthDate && deviceReadings[key].created_at <= thirdDate) {
                    fourCounterReading += parseInt(deviceReadings[key].tank_reading);
                    fourHourCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at >= thirdDate && deviceReadings[key].created_at <= secondDate) {
                    threeCounterReading += parseInt(deviceReadings[key].tank_reading);
                    threeHourCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at >= secondDate && deviceReadings[key].created_at <= firstDate) {
                    twoCounterReading += parseInt(deviceReadings[key].tank_reading);
                    twoHourCounter++;
                    flag = true;
                  } else if (deviceReadings[key].created_at >= firstDate) {
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
                    "name": DateService.getFormatedHour(new Date(firstDate).getUTCHours())
                  }, {
                    "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                    "name": DateService.getFormatedHour(new Date(secondDate).getUTCHours())
                  },
                    {
                      "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                      "name": DateService.getFormatedHour(new Date(thirdDate).getUTCHours())
                    },
                    {
                      "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                      "name": DateService.getFormatedHour(new Date(fourthDate).getUTCHours())
                    },
                    {
                      "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                      "name": DateService.getFormatedHour(new Date(fifthDate).getUTCHours())
                    },
                    {
                      "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                      "name": DateService.getFormatedHour(new Date(sixthDate).getUTCHours())
                    }
                  ]
                ]);
              } else {
                return res.json([]);
              }
            } else {
              return res.json([]);
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });*/
        } else {
          return res.serverError('parameter missing');
        }
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
                  });
                  return res.json([]);
                } else {
                  return res.json([]);
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
                  });
                  return res.json([]);
                } else {
                  console.log('false111...');
                  return res.json([]);
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
                    });
                  }
                  if (req.body.mobileBatteryLevel < sails.config.min_device_battery_level) {
                    var info = {
                      userId: req.body.userId,
                      type: 'low_device_battery',
                      title: 'Device battery is low',
                      body: 'Your device battery at minimum level. Charge ' + req.body.mobileBatteryLevel + ' device battery',
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
                    });
                  }
                  if (req.body.alertLevel > req.body.tankReading) {
                    var info = {
                      userId: req.body.userId,
                      type: 'low_tank_level',
                      title: req.body.deviceName + ' is content only ' + req.body.tankReading + ' water level',
                      body: 'Your tank ' + req.body.deviceName + ' is content only ' + req.body.tankReading + ' water. Please fill the tank as soon as posible',
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
      return res.json([]);
    } else {
      console.log('false...');
      return res.serverError('parameter missing');
    }
  },

};
