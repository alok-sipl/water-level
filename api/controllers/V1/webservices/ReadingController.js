/**
 * V1/webservices/ReadingController
 *
 * @description :: Server-side logic for managing v1/webservices/readings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
// Create a GeoFire index
module.exports = {

  /*
     * Name: tankReading
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  deviceReading: function(req, res) {
    var ref = db.ref();
    var likes = ref.child("device_reading");
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "55",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "16",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "3",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "88",
        created_date: Date.now()
    });
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "12",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "50",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "56",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "98",
        created_date: Date.now()
    });
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "99",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "74",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "71",
        created_date: Date.now()
    });
    var newSubCities = likes.push();
    newSubCities.set({
        device_id: "-L0oJuC3wNmUAnuic-or",
        reading: "89",
        created_date: Date.now()
    });
},
  tankReading: function (req, res) {
    var deviceId = req.param('deviceId');
    var timeFilter = req.param('timeFilter');
    var data = [];
    var jsonData = [];
    var deviceReadingList = [];
    var array = [];
    var deviceReadings;
    // Get current date time in ISO format
    var currentDateTimeStamp = new Date();
    var currentDateTime = currentDateTimeStamp.toISOString();
    //convert ISO format  to timestamp
    var currentDateTimeString = Date.parse(currentDateTime);
    // Current timestamp
    var currentTimeStamp  =   currentDateTimeString/1000;

    var pastSixHrsDateTime = new Date(new Date() - (10 * 60 * 60 * 1000)).toISOString();
    var pastDateTimeString = Date.parse(pastSixHrsDateTime);
    // past 6 hrs timestamp
    var pastTimeStamp  =   pastDateTimeString/1000;

    var refDeviceReading = db.ref("device_reading");
    var tankReading = [];
    refDeviceReading.orderByChild('device_id').equalTo('-L0oJuC3wNmUAnuic-or').once("value", function(snapshot) {
      deviceReadings = snapshot.val();
      Object.keys(deviceReadings).forEach(key => {
        var readingDataObject =  {};

        if(deviceReadings[key].created_date >= pastDateTimeString && deviceReadings[key].created_date <= currentDateTimeString ){
          //readingDataObject["reading_id"] = key;
          readingDataObject["name"] = new Date(deviceReadings[key].created_date).getUTCHours();
        //  readingDataObject["device_id"]  = deviceReadings[key].device_id;;
          readingDataObject["v"] = deviceReadings[key].reading;
          deviceReadingList.push(readingDataObject)
        }

      });
      tankReading.push(deviceReadingList);
    });


    var deviceId = req.param('deviceId');
    var timeFilter = req.param('timeFilter');
    var data = [];
    if('day'){
      data = [
        [{ "v": 49, "name": "1 PM" },
          { "v": 42, "name": "2 PM" },
          { "v": 29, "name": "3 PM" },
          { "v": 50, "name": "4 PM" },
          { "v": 60, "name": "5 PM" }
        ]
      ];
    }else if('week'){
      data = [
        [{ "v": 49, "name": "1 Week" },
          { "v": 42, "name": "2 Week" },
          { "v": 29, "name": "3 Week" },
          { "v": 50, "name": "4 Week" },
          { "v": 60, "name": "5 Week" }
        ]
      ];
    }else if('month'){
      data = [
        [{ "v": 49, "name": "Aug" },
          { "v": 42, "name": "Sep" },
          { "v": 29, "name": "Oct" },
          { "v": 50, "name": "Nov" },
          { "v": 60, "name": "Dec" }
        ]
      ];
    }
    return res.json(data);
  },
  supplierListing: function (req, res) {
    var currLat1 = "22.743564";
    var currLong1 = "75.89674600000001";
    var jsonData = [];
    var favouritesSuppliresId = [];
    var array = [];
    var favouritesSupplires ="";
    var reflikedSuppliers = db.ref("likes");

    reflikedSuppliers.orderByChild('user_id').equalTo('-L0UbCoAiFk06mBEYfDZ').once("value", function(snapshot) {
      favouritesSupplires = snapshot.val();
      console.log(favouritesSupplires);

      Object.keys(favouritesSupplires).forEach(key => {
        if(favouritesSuppliresId.indexOf(favouritesSupplires[key].supplier_id) === -1){
            favouritesSuppliresId.push(favouritesSupplires[key].supplier_id);
         }
      });
    });

    var refSuppliers = db.ref("suppliers");
    refSuppliers.orderByKey().on("value", function (snapshot) {
    var suppliers = snapshot.val();

     Object.keys(suppliers).forEach(key => {
        var supplierWithDistance = {};
        distance =   ValidationService.getDistanceFromLatLonInKm(currLat1,currLong1,suppliers[key].latitude,suppliers[key].longitude);

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
        if(favouritesSuppliresId.indexOf(key)){
          supplierWithDistance["is_fav"] = 1;
        }else{
          supplierWithDistance["is_fav"] = 0;
        }
        if(distance &&  distance < 40 ){
          jsonData.push(supplierWithDistance);
        }
  });
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

},


};