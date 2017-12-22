/**
 * CityController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var db = sails.config.globals.firebasedb();
module.exports = {
  /**
   * CommentController.create()
   */
  index: function (req, res) {
    return res.view('city-listing');
  },

  /*
    * Name: cityList
    * Created By: A-SIPL
    * Created Date: 11-dec-2017
    * Purpose: get all city data
    * @param  type
    */
  cityList: function (req, res) {
    // var country = {};
    // var ref = db.ref('cities');
    // ref.on("child_added", function (snapshot) {
    //   //console.log("Information-->", snapshot.val(), '');
    //   //console.log("Country Id-->", snapshot.val().country_id, '');
    //   //console.log("Key--", snapshot.key, '', '');
    //   console.log("URL:--", "countries/" + snapshot.val().country_id);
    //   var countryRef = ref.child("countries/" + snapshot.val().country_id)
    //   countryRef.once("value", function(data) {
    //     console.log("Country Detail:--", data.val());
    //   });
    // });
    //
    // var city = {};
    // var ref = db.ref('country');
    // ref.on("value", function (snapshot) {
    //   var changedPost = snapshot.val();
    //   city = snapshot.val();
    // });
    /* country listing*/
    cities = [];
    countries = [];
    var ref = db.ref('countries');
    ref.on("value", function (snapshot) {
      countries = snapshot.val();
      var ref = db.ref("cities");
      ref.on('value', function (snap) {
        var cityJson     = (Object.keys(snap).length) ? getCityList(snap, countries) : {};
        return res.json({'rows':cityJson});
      });
    });
  },

  /*
    * Name: addCity
    * Created By: A-SIPL
    * Created Date: 9-dec-2017
    * Purpose: add new city location
    * @param  type
    */
  addCity: function (req, res) {
    async.waterfall([
      function (cb) {
        if (req.method == 'GET') {
          var country = {};
          var city = {};
          var ref = db.ref('countries');
          ref.on("value", function (snapshot) {
            country = snapshot.val();
            return res.view('add-update-city', {'country': country, type: req.params.id});
          });
        } else {
          var ref = db.ref();
          var postsRef = db.ref('countries/' + req.param('country'));
          postsRef.push({
            name: req.param('city'),
            is_deleted: 0
          });
          return res.redirect('city');
        }
      }
    ])
  },

  /*
    * Name: updateCity
    * Created By: A-SIPL
    * Created Date: 13-dec-2017
    * Purpose: add new city location
    * @param  type
    */
  updateCity: function (req, res) {
    async.waterfall([
      function(cb) {
        var ref = db.ref();
        var postsRef = ref.child("countries/-L0E-tknbeJKkXDSQHzr/");
        var newPostRef = postsRef.push();
        newPostRef.set({
          name: 'Alok ',
          is_deleted: 0,
        });
      }
    ])
  },


  /*
  * Name: addCity
  * Created By: A-SIPL
  * Created Date: 9-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addCountry: function (req, res) {
    var ref = db.ref();
    var cities = ref.child("countries");
    var newCities = cities.push();
    newCities.set({
      name: 'France',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'China',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'Spain',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'Singapore',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'Switzerland',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'Belgium',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'India',
      is_deleted: 0
    });
    var newCities = cities.push();
    newCities.set({
      name: 'Japan',
      is_deleted: 0
    });
  },


  /*
  * Name: addCity
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addCities: function (req, res) {
    async.waterfall([
      function(cb) {
        var ref = db.ref();
        var cities = ref.child("cities");
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Indore',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Mumbai',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Delhi',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Pune',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Baroda',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Raipur',
          is_deleted: 0
        });
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Bhapal',
          is_deleted: 0
        });
      }
    ])
  },


  /*
  * Name: addSubCities
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addSubCities: function (req, res) {
    async.waterfall([
      function(cb) {
        var ref = db.ref();
        var subcities = ref.child("subcities");
        var newSubCities = subcities.push();
        newSubCities.set({
          city_id: "-L0Ik_h7YmN-8ZaRdQH_",
          name: 'Los Vegas',
          is_deleted: 0
        });
      }
    ])
  },


  /*
  * Name: getCityByCountry
  * Created By: A-SIPL
  * Created Date: 18-dec-2017
  * Purpose: aget city of the selected country
  * @param  type
  */
  getCityByCountry: function (req, res) {
    if(req.body.id) {
      console.log(req.body.id);
        const ref = db.ref('cities');
        ref.orderByChild('country_id')
          .equalTo(req.body.id)
          .on("value",function (snapshot) {
            return res.json(snapshot.val());
          });
    }
  },


  /*
  * Name: addSubCities
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addUser: function (req, res) {
    async.waterfall([
      function(cb) {
        var ref = db.ref();
        var subcities = ref.child("users");
        var newSubCities = subcities.push();
        newSubCities.push({
          account_number: "2234522586",
          area: 'Dewas',
          city_id: "-L0Ik_goeeUdNOKTJ_DB",
          country_id: "-L0E-tknbeJKkXDSQHzr",
          createdAt: 1512749459933,
          email: "abc@gmail.com",
          isOnline: true,
          name: "SS",
          password:"123456",
          phone:"99999922222"
        });
      }
    ])
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  view: function (req, res) {
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.on("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'user': user, errors: errors,countries: countries, isEdit: false,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });

    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
   * Name: edit
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  edit:function(req, res){
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.on("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'user': user, errors: errors,countries: countries, isEdit: true,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });

    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
   * Name: subCities
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  subCity: function (req, res) {
    return res.view('subcity-listing');
  },
};



/*
   * Name: getUserList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getCityList(snap, countries){
  console.log("Country Detail is-->", countries['-L0E-tknbeJKkXDSQHzr']['name']);
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      city = childSnap.val();
      updateCity = city;
      country_id = city.country_id;
      //console.log("id is-->", country_id);
      //console.log("Country id is-->", countries[country_id]['name']);
      updateCity.city_id =  childSnap.key;
      updateCity.country_name =  countries[country_id]['name'];
      cities.push(updateCity);
    });
    return cities;
  }else{
    users ={}
    return cities;
  }
}

