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
    console.log('Post param-->',req.body);
    if(req.body != undefined && req.body.deviceId != undefined && req.body.timeFilter != undefined && req.body.type != undefined && req.body.deviceId != '' && req.body.timeFilter != '' && req.body.type != '') {
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
            var sixHourDate = date.setHours(date.getHours() - 200);
            var date = new Date();
            var currentdate = date.setSeconds(date.getSeconds() - 1);
            var fiveCounterReading = 0;
            var fiveHourCounter = 0;
            var date = new Date();
            var fiveHourDate = date.setHours(date.getHours() - 199);
            var fourCounterReading = 0;
            var fourHourCounter = 0;
            var date = new Date();
            var fourHourDate = date.setHours(date.getHours() - 198);
            var threeCounterReading = 0;
            var threeHourCounter = 0;
            var date = new Date();
            var threeHourDate = date.setHours(date.getHours() - 197);
            var twoCounterReading = 0;
            var twoHourCounter = 0;
            var date = new Date();
            var twoHourDate = date.setHours(date.getHours() - 196);
            var oneCounterReading = 0;
            var oneHourCounter = 0;
            var date = new Date();
            var oneHourDate = date.setHours(date.getHours() - 195);

            if (deviceReadings != undefined && deviceReadings != '' && Object.keys(deviceReadings).length) {
              for (key in deviceReadings) {
                var readingDataObject = {};
                if (deviceReadings[key].created_date >= sixHourDate && deviceReadings[key].created_date <= currentdate) {
                  if (deviceReadings[key].created_date >= fiveHourDate && deviceReadings[key].created_date <= fourHourDate) {
                    fiveCounterReading += parseInt(deviceReadings[key].reading);
                    fiveHourCounter++;
                  } else if (deviceReadings[key].created_date >= fourHourDate && deviceReadings[key].created_date <= threeHourDate) {
                    fourCounterReading += parseInt(deviceReadings[key].reading);
                    fourHourCounter++;
                  } else if (deviceReadings[key].created_date >= threeHourDate && deviceReadings[key].created_date <= twoHourDate) {
                    threeCounterReading += parseInt(deviceReadings[key].reading);
                    threeHourCounter++;
                  } else if (deviceReadings[key].created_date >= twoHourDate && deviceReadings[key].created_date <= oneHourDate) {
                    twoCounterReading += parseInt(deviceReadings[key].reading);
                    twoHourCounter++;
                  } else if (deviceReadings[key].created_date >= oneHourDate) {
                    oneCounterReading += parseInt(deviceReadings[key].reading);
                    oneHourCounter++;
                  }
                }
              }
              return res.json([
                [{
                  "v": ((fiveCounterReading / fiveHourCounter) > 0) ? Math.round(fiveCounterReading / fiveHourCounter) : 0,
                  "name": (new Date(fiveHourDate).getUTCHours() >= 12 ? (new Date(fiveHourDate).getUTCHours() % 12 + ' PM') : (new Date(fiveHourDate).getUTCHours() + ' AM'))
                },
                  {
                    "v": ((fourCounterReading / fourHourCounter) > 0) ? Math.round(fourCounterReading / fourHourCounter) : 0,
                    "name": (new Date(fourHourDate).getUTCHours() >= 12 ? (new Date(fourHourDate).getUTCHours() % 12 + ' PM') : (new Date(fourHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": ((threeCounterReading / threeHourCounter) > 0) ? Math.round(threeCounterReading / threeHourCounter) : 0,
                    "name": (new Date(threeHourDate).getUTCHours() >= 12 ? (new Date(threeHourDate).getUTCHours() % 12 + ' PM') : (new Date(threeHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": ((twoCounterReading / twoHourCounter) > 0) ? Math.round(twoCounterReading / twoHourCounter) : 0,
                    "name": (new Date(twoHourDate).getUTCHours() >= 12 ? (new Date(twoHourDate).getUTCHours() % 12 + ' PM') : (new Date(twoHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": ((oneCounterReading / oneHourCounter) > 0) ? Math.round(oneCounterReading / oneHourCounter) : 0,
                    "name": (new Date(oneHourDate).getUTCHours() >= 12 ? (new Date(oneHourDate).getUTCHours() % 12 + ' PM') : (new Date(oneHourDate).getUTCHours() + ' AM'))
                  }
                ]
              ]);
            } else {
              return res.json([
                [{
                  "v": 0,
                  "name": (new Date(fiveHourDate).getUTCHours() >= 12 ? (new Date(fiveHourDate).getUTCHours() % 12 + ' PM') : (new Date(fiveHourDate).getUTCHours() + ' AM'))
                },
                  {
                    "v": 0,
                    "name": (new Date(fourHourDate).getUTCHours() >= 12 ? (new Date(fourHourDate).getUTCHours() % 12 + ' PM') : (new Date(fourHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": 0,
                    "name": (new Date(threeHourDate).getUTCHours() >= 12 ? (new Date(threeHourDate).getUTCHours() % 12 + ' PM') : (new Date(threeHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": 0,
                    "name": (new Date(twoHourDate).getUTCHours() >= 12 ? (new Date(twoHourDate).getUTCHours() % 12 + ' PM') : (new Date(twoHourDate).getUTCHours() + ' AM'))
                  },
                  {
                    "v": 0,
                    "name": (new Date(oneHourDate).getUTCHours() >= 12 ? (new Date(oneHourDate).getUTCHours() % 12 + ' PM') : (new Date(oneHourDate).getUTCHours() + ' AM'))
                  }
                ]
              ]);
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
                if (deviceReadings[key].created_date >= eigthDayDate && deviceReadings[key].created_date <= currentdate) {
                  if (deviceReadings[key].created_date >= sevenDayDate && deviceReadings[key].created_date <= sixDayDate) {
                    sevenCounterReading += parseInt(deviceReadings[key].reading);
                    sevenHourCounter++;
                  } else if (deviceReadings[key].created_date >= sixDayDate && deviceReadings[key].created_date <= fiveDayDate) {
                    sixCounterReading += parseInt(deviceReadings[key].reading);
                    sixHourCounter++;
                  } else if (deviceReadings[key].created_date >= fiveDayDate && deviceReadings[key].created_date <= fourDayDate) {
                    fiveCounterReading += parseInt(deviceReadings[key].reading);
                    fiveHourCounter++;
                  } else if (deviceReadings[key].created_date >= fourDayDate && deviceReadings[key].created_date <= threeDayDate) {
                    fourCounterReading += parseInt(deviceReadings[key].reading);
                    fourHourCounter++;
                  } else if (deviceReadings[key].created_date >= threeDayDate && deviceReadings[key].created_date <= twoDayDate) {
                    threeCounterReading += parseInt(deviceReadings[key].reading);
                    threeHourCounter++;
                  } else if (deviceReadings[key].created_date >= twoDayDate && deviceReadings[key].created_date <= oneDayDate) {
                    twoCounterReading += parseInt(deviceReadings[key].reading);
                    twoHourCounter++;
                  } else if (deviceReadings[key].created_date >= oneDayDate) {
                    oneCounterReading += parseInt(deviceReadings[key].reading);
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
              return res.json([
                [{
                  "v": 0,
                  "name": days[new Date(sevenDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(sixDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(fiveDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(fourDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(threeDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(twoDayDate).getDay()]
                }, {
                  "v": 0,
                  "name": days[new Date(oneDayDate).getDay()]
                }
                ]
              ]);
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
                if (deviceReadings[key].created_date >= fiveWeekDate && deviceReadings[key].created_date <= currentdate) {
                  if (deviceReadings[key].created_date >= fourWeekDate && deviceReadings[key].created_date <= threeWeekDate) {
                    fourCounterReading += parseInt(deviceReadings[key].reading);
                    fourHourCounter++;
                  } else if (deviceReadings[key].created_date >= threeWeekDate && deviceReadings[key].created_date <= twoWeekDate) {
                    threeCounterReading += parseInt(deviceReadings[key].reading);
                    threeHourCounter++;
                  } else if (deviceReadings[key].created_date >= twoWeekDate && deviceReadings[key].created_date <= oneWeekDate) {
                    twoCounterReading += parseInt(deviceReadings[key].reading);
                    twoHourCounter++;
                  } else if (deviceReadings[key].created_date >= oneWeekDate) {
                    oneCounterReading += parseInt(deviceReadings[key].reading);
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
              return res.json([
                [{
                  "v": 0,
                  "name": "Week 4",
                }, {
                  "v": 0,
                  "name": "Week 3",
                }, {
                  "v": 0,
                  "name": "Week 2",
                }, {
                  "v": 0,
                  "name": "Week 1",
                }
                ]
              ]);
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
      } else if (timeFilter == "day" && type == "device") {
        return res.json([
          [{
            "v": 0,
            "name": "1 1PM",
          }, {
            "v": 0,
            "name": "2 PM",
          }, {
            "v": 0,
            "name": "3 PM",
          }, {
            "v": 0,
            "name": "4PM",
          }
          ]
        ]);
      } else {
        return res.serverError('invalid paramter');
      }
    }else {
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
  supplierListing: function (req, res) {
    if (req.body != undefined && req.body.userId != '' && req.body.userId != undefined && req.body.latitude != '' && req.body.latitude != undefined && req.body.longitude != '' && req.body.longitude != undefined) {
      var userId = req.body.userId;
      var latitude = req.body.latitude;
      var longitude = req.body.longitude;
      var tankCapacity = (req.body.tankCapacity && req.body.tankCapacity != undefined) ? req.body.tankCapacity : 0;
      var jsonData = [];
      var favouritesSuppliresId = [];
      var array = [];
      var favouritesSupplires = "";
      var reflikedSuppliers = db.ref("likes");
      reflikedSuppliers.orderByChild('user_id').equalTo(userId).once("value",
        function (snapshot) {
          favouritesSupplires = snapshot.val();
          for (key in favouritesSupplires) {
            if (favouritesSuppliresId.indexOf(favouritesSupplires[key].supplier_id) === -1) {
              favouritesSuppliresId.push(favouritesSupplires[key].supplier_id);
            }
          }
        });
      var refSuppliers = db.ref("suppliers");
      refSuppliers.once("value", function (snapshot) {
        var suppliers = snapshot.val();
        for (key in suppliers) {
          if (suppliers[key].tank_capacity != undefined && suppliers[key].tank_capacity >= tankCapacity) {
            var supplierWithDistance = {};
            distance = ValidationService.getDistanceFromLatLonInKm(latitude, longitude, suppliers[key].latitude, suppliers[key].longitude);
            supplierWithDistance["supplier_id"] = key;
            supplierWithDistance["distance_in_km"] = distance;
            supplierWithDistance["account_number"] = suppliers[key].account_number;
            supplierWithDistance["area"] = suppliers[key].area;
            supplierWithDistance["city_id"] = suppliers[key].city_id;
            supplierWithDistance["city_name"] = suppliers[key].city_name;
            supplierWithDistance["company_name"] = suppliers[key].company_name;
            supplierWithDistance["country_id"] = suppliers[key].country_id;
            supplierWithDistance["country_name"] = suppliers[key].country_name;
            supplierWithDistance["created_date"] = suppliers[key].created_date;
            supplierWithDistance["email"] = suppliers[key].email;
            supplierWithDistance["latitude"] = suppliers[key].latitude;
            supplierWithDistance["longitude"] = suppliers[key].longitude;
            supplierWithDistance["mobile_number"] = suppliers[key].mobile_number;
            supplierWithDistance["name"] = suppliers[key].name;
            supplierWithDistance["tank_capacity"] = suppliers[key].tank_capacity;
            if (favouritesSuppliresId.indexOf(key)) {
              supplierWithDistance["is_fav"] = 1;
            } else {
              supplierWithDistance["is_fav"] = 0;
            }
            if (distance && distance < sails.config.supplier_range) {
              jsonData.push(supplierWithDistance);
            }
          }
        }
        array.push(jsonData);
        array[0].sort(function (x, y) {
          var n = x.distance_in_km - y.distance_in_km;
          if (n != 0) {
            return n;
          }
          return x.is_fav - y.is_fav;
        });
        return res.json(array[0]);
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    } else {
      res.status(422);
      res.send(sails.config.flash.paramter_missing);
    }
  },

};
