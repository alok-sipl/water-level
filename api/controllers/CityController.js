/**
 * CityController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var db = sails.config.globals.firebasedb();
const googleStorage = require('@google-cloud/storage');
module.exports = {
  /**
   * CommentController.create()
   */
  index: function (req, res) {
    return res.view('city-listing', {title: sails.config.title.city_list});
  },

  /*
    * Name: cityList
    * Created By: A-SIPL
    * Created Date: 11-dec-2017
    * Purpose: get all city data
    * @param  type
    */
  cityList: function (req, res) {
    cities = [];
    countries = [];
    var ref = db.ref('countries');
    ref.once("value", function (snapshot) {
      countries = snapshot.val();
      var ref = db.ref("cities");
      ref.once('value', function (snap) {
        var cityJson = (Object.keys(snap).length) ? getCityList(snap, countries) : {};
        return res.json({'rows': cityJson});
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
          ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            country = snapshot.val();
            return res.view('add-update-city', {
              title: sails.config.title.add_city,
              'country': country,
              'type': true
            });
          });
        } else {
          var ref = db.ref("cities");
          ref.push({
            country_id: req.param('country'),
            name: req.param('city'),
            created_date: Date.now(),
            modified_date: Date.now(),
            is_deleted: false
          }).then(function () {
            req.flash('flashMessage', '<div class="alert alert-success">'+ sails.config.flash.city_add_success+'</div>');
            return res.redirect('city');
          }, function (error) {
            req.flash('flashMessage', '<div class="alert alert-danger">'+ sails.config.flash.city_add_error+'</div>');
            return res.redirect('city');
          });
        }
      }
    ])
  },


  /*
    * Name: addLocation
    * Created By: A-SIPL
    * Created Date: 05-jan-2018
    * Purpose: add new location
    * @param  type
    */
  addLocation: function (req, res) {
    if (req.method == 'GET') {
      var country = {};
      var cities = {};
      var ref = db.ref('cities/'+ req.params.id);
      ref.once("value", function (snapshot) {
        cities = snapshot.val();
        var ref = db.ref('countries');
        ref.orderByChild("is_deleted").equalTo(false)
        .once("value", function (snapshot) {
          country = snapshot.val();
          return res.view('add-update-city', {
            title: sails.config.title.add_city,
            'countryId': cities.country_id,
            'cityId': req.params.id,
            'country': country,
            'cities': cities,
            'type': false
          });
        });
      });
    } else {
      var ref = db.ref("locations");
      ref.push({
        name: req.param('area'),
        city_id: req.param('city'),
        created_date: Date.now(),
        modified_date: Date.now(),
        is_deleted: false
      }).then(function () {
        req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.location_add_success + '</div>');
        return res.redirect('city');
      }, function (error) {
        req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.location_add_error + '</div>');
        return res.redirect('city');
      });
    }
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
      name: 'India',
      is_deleted: false
    });
  },

  /*
  * Name: getCityByCountry
  * Created By: A-SIPL
  * Created Date: 18-dec-2017
  * Purpose: aget city of the selected country
  * @param  type
  */
  getCityByCountry: function (req, res) {
    if (req.body.id) {
      const ref = db.ref('cities');
      ref.orderByChild('country_id')
        .equalTo(req.body.id)
        .once("value", function (snapshot) {
          return res.json(snapshot.val());
        });
    } else {
      return res.json({});
    }
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  view: function (req, res) {
    /* cities detail */
    var errors = {};
    var ref = db.ref("cities");
    ref.once("value", function (snapshot) {
      var cities = snapshot.val();
      /* countries listing*/
      var ref = db.ref("countries");
      ref.orderByChild("is_deleted").equalTo(false)
      .once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('location-listing', {
          title: sails.config.title.location_list,
          cityId: req.params.id,
          cities: cities,
          countries: countries
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
  edit: function (req, res) {
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        var ref = db.ref("cities");
        ref.once("value", function (snapshot) {
          var cities = snapshot.val();
          /* city listing*/
          var ref = db.ref("countries");
          ref.once("value", function (snapshot) {
            var countries = snapshot.val();
            return res.view('view-edit-city', {
              title: sails.config.title.edit_city,
              'city': cities[req.params.id],
              'cities': cities,
              'countries': countries,
              'errors': errors,
              'isEdit': true,
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });

        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var status = (req.param('status') == false || req.param('status') == "false") ? false : true;
        db.ref('cities/' + req.param('city_id'))
          .update({
          'country_id': req.param('country'),
          'is_deleted': status,
          'name': req.param('city'),
            'modified_date': Date.now(),
        }).then(function () {
          req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.city_edit_success + '</div>');
          return res.redirect('city');
        })
          .catch(function (err) {
            req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.city_edit_error + '</div>');
            return res.redirect('city');
          });
      }
    } else {
      var ref = db.ref("cities");
      ref.once("value", function (snapshot) {
        var cities = snapshot.val();
        /* city listing*/
        var ref = db.ref("countries");
        ref.orderByChild("is_deleted").equalTo(false)
        .once("value", function (snapshot) {
          var countries = snapshot.val();
          return res.view('view-edit-city', {
            title: sails.config.title.edit_city,
            'city': cities[req.params.id],
            'cities': cities,
            'countries': countries,
            'errors': errors,
            'isEdit': true,
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });

      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },


  /*
   * Name: editLocation
   * Created By: A-SIPL
   * Created Date: 27-dec-2017
   * Purpose: Edit location
   * @param  req
   */
  editLocation: function (req, res) {
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
      } else {
        var status = (req.param('status') == "false") ? false : true
        var ref = db.ref();
        var usersRef = ref.child('cities/' + req.param('city_id'));
        usersRef.update({
          'country_id': req.param('country'),
          'is_deleted': status,
          'modified_date': Date.now(),
          'name': req.param('city'),
        });
        return res.redirect('/city');
      }
    } else {
      var errors = {};
      var ref = db.ref("locations/" + req.params.id);
      ref.once("value", function (snapshot) {
        var locations = snapshot.val();
        var ref = db.ref("cities");
        ref.orderByChild("is_deleted").equalTo(false)
        .once("value", function (snapshot) {
          var cities = snapshot.val();
          /* city listing*/
          var ref = db.ref("countries");
          ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            var countries = snapshot.val();
            return res.view('view-edit-location', {
              title: sails.config.title.edit_location,
              'locations': locations, 'cities': cities, countries: countries, errors: errors, isEdit: true,
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });

        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
   * Name: locations
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  location: function (req, res) {
    return res.view('location-listing', {title: sails.config.title.view_location});
  },


  /*
    * Name: cityList
    * Created By: A-SIPL
    * Created Date: 11-dec-2017
    * Purpose: get all city data
    * @param  type
    */
  locationList: function (req, res) {
    locations = [];
    cities = [];
    var cityId = (req.query.cityId != undefined) ? req.params.id : '';
    var ref = db.ref('cities/' + req.query.cityId);
    ref.once("value", function (snapshot) {
      cities = snapshot.val();
      var ref = db.ref("locations");
      ref.orderByChild("city_id").equalTo(req.query.cityId).once("value", function (snap) {
        var cityJson = (Object.keys(snap).length) ? getLocationList(snap, cities) : {};
        return res.json({'rows': cityJson});
      });
    });
  },

  /*
 * Name: updateStatus
 * Created By: A-SIPL
 * Created Date: 26-dec-2017
 * Purpose: Update status of city
 * @param  req
 */
  updateStatus: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('/cities/' + id)
        .update({
          'is_deleted': status,
          'modified_date': Date.now(),
        })
        .then(function () {
          return res.json({'status': true, message: sails.config.flash.update_successfully});
        })
        .catch(function (err) {
          res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
        });
    } else {
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },

  /*
* Name: updateLocationStatus
* Created By: A-SIPL
* Created Date: 07-jan-2018
* Purpose: Update status of location
* @param  req
*/
  updateLocationStatus: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('/locations/' + id)
        .update({
          'is_deleted': status,
          'modified_date': Date.now(),
        })
        .then(function () {
          return res.json({'status': true, message: sails.config.flash.update_successfully});
        })
        .catch(function (err) {
          res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
        });
    } else {
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },

  moveFbRecord: function() {
      var oldRef = db.ref('users/-L241aMXvbCuJhGpV-Hy');
     oldRef.once('value', function(snap)  {
         var newRef = db.ref('users/siplindia');
          newRef.set( snap.val(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}

};


/*
   * Name: getUserList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getCityList(snap, countries) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      city = childSnap.val();
      updateCity = city;
      country_id = city.country_id;
      //console.log("id is-->", country_id);
      //console.log("Country id is-->", countries[country_id]['name']);
      updateCity.city_id = childSnap.key;
      updateCity.country_name = countries[country_id]['name'];
      cities.push(updateCity);
    });
    cities.sort(function (a, b) {
            return b.created_date - a.created_date;
        })
    return cities;
  } else {
    cities = {}
    return cities;
  }
}


/*
   * Name: getLocationList
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: sget the user grid data
   * @param  req
   */
function getLocationList(snap, cities) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      location = childSnap.val();
      updateLocation = location;
      city_id = location.city_id;
      updateLocation.city_id = childSnap.key;
      updateLocation.city_name = cities['name'];
      locations.push(updateLocation);
    });
    locations.sort(function (a, b) {
            return b.created_date - a.created_date;
        })
    return locations;
  } else {
    locations = {}
    return locations;
  }
}

