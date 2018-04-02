/**
 * CityController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var db = sails.config.globals.firebasedb();
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
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
            'type': true,
            'errors': {}
          });
        });
    } else {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        var country = {};
        var city = {};
        var ref = db.ref('countries');
        ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            country = snapshot.val();
            return res.view('add-update-city', {
              title: sails.config.title.add_city,
              'country': country,
              'type': true,
              'errors': errors
            });
          });
      } else {
        var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
        var ref = db.ref("cities");
        ref.push({
          country_id: req.param('country'),
          name: req.param('city'),
          created_at: Date.now(),
          modified_at: Date.now(),
          is_deleted: status,
        }).then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.city_add_success + '</div>');
          return res.redirect('city');
        }, function (error) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_add_error + '</div>');
          return res.redirect('city');
        });
      }
    }
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
      var ref = db.ref('cities/' + req.params.id);
      ref.once("value", function (snapshot) {
        cities = snapshot.val();
        var ref = db.ref('countries');
        ref.once("value", function (snapshot) {
          country = snapshot.val();
          return res.view('add-update-city', {
            title: sails.config.title.add_location,
            'countryId': (cities.country_id != undefined) ? cities.country_id : '',
            'cityId': req.params.id,
            'country': country,
            'cities': cities,
            'type': false,
            'errors': {}
          });
        });
      });
    } else {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        var country = {};
        var cities = {};
        var ref = db.ref('cities/' + req.params.id);
        ref.once("value", function (snapshot) {
          cities = snapshot.val();
          var ref = db.ref('countries');
          ref.once("value", function (snapshot) {
            country = snapshot.val();
            return res.view('add-update-city', {
              title: sails.config.title.add_location,
              'countryId': (cities.country_id != undefined) ? cities.country_id : '',
              'cityId': req.params.id,
              'country': country,
              'cities': cities,
              'type': false,
              'errors': errors
            });
          });
        });
      } else {
        var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
        var ref = db.ref("locations");
        ref.push({
          name: req.param('area'),
          city_id: req.param('city'),
          latitude: req.param('latitude'),
          longitude: req.param('longitude'),
          created_at: Date.now(),
          modified_at: Date.now(),
          is_deleted: status
        }).then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.location_add_success + '</div>');
          return res.redirect('city/view/' + req.param('city_id'));
        }, function (error) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.location_add_error + '</div>');
          return res.redirect('city/addLocation/' + req.param('city_id'));
        });
      }
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
      name: 'Saudi Arabia',
      is_deleted: false,
      code: 'SA'
    });
    // var parser = parse({delimiter: ','}, function (err, data) {
    //   data.forEach(function(line) {
    //     // create country object out of parsed fields
    //     var country = { "code" : line[1],
    //       "name" : line[2],
    //       "is_deleted" : false,
    //
    //     };
    //     console.log('Rows--->',JSON.stringify(country));
    //     var cities = db.ref().child("countries");
    //     var newCities = cities.push();
    //     newCities.set(country);
    //   });
    // });
    // fs.createReadStream('countries.csv').pipe(parser);
  },

  /*
* Name: addCity
* Created By: A-SIPL
* Created Date: 9-dec-2017
* Purpose: add new city location
* @param  type
*/
  addCity: function (req, res) {
    // var ref = db.ref();
    // var cities = ref.child("countries");
    // var newCities = cities.push();
    // newCities.set({
    //   name: 'Saudi Arabia',
    //   is_deleted: false,
    //   code: 'SA'
    // });
    // var parser = parse({delimiter: ','}, function (err, data) {
    //   data.forEach(function(line) {
    //     // create country object out of parsed fields
    //     var country = {
    //       'country_id': '-L81ZMEAR0WpgLtk59xa',
    //       'created_at': Date.now(),
    //       'modified_at': Date.now(),
    //       "name" : line[1].substring( 0, 1 ).toUpperCase() + line[1].substring( 1 ),
    //       "is_deleted" : false,
    //
    //     };
    //     console.log('Rows--->',JSON.stringify(country));
    //     var cities = db.ref().child("cities");
    //     var newCities = cities.push();
    //     newCities.set(country);
    //   });
    // });
    // // fs.createReadStream('cities.csv').pipe(parser);
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
          cityList = snapshot.val();
          var returnArr = [];
          if (cityList != null && Object.keys(cityList).length) {
            for (var key in cityList) {
              if (cityList[key]['is_deleted'] != undefined && (cityList[key]['is_deleted'] == 'true' || cityList[key]['is_deleted'] == true)) {
                delete cityList[key];
              }else{
                var item = cityList[key];
                item.key = key;
                returnArr.push(item);
              }
            }
            returnArr = returnArr.sort(function(a, b) {
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
            return res.json(returnArr);
          } else {
            return res.json(cityList);
          }
        }, function (errorObject) {
          cosnole.log(errorObject);
          return res.serverError(errorObject.code);
        });
    } else {
      return res.json({});
    }
  },

  /*
  * Name: getLocationByCity
  * Created By: A-SIPL
  * Created Date: 06-feb-2018
  * Purpose: get area of the selected city
  * @param  type
  */
  getLocationByCity: function (req, res) {
    if (req.body.id) {
      const ref = db.ref('locations');
      ref.orderByChild('city_id')
        .equalTo(req.body.id)
        .once("value", function (snapshot) {
          areaList = snapshot.val();
          var returnArr = [];
          if (areaList != null && Object.keys(areaList).length) {
            for (var key in areaList) {
              if (areaList[key]['is_deleted'] != undefined && (areaList[key]['is_deleted'] == 'true' || areaList[key]['is_deleted'] == true)) {
                delete areaList[key];
              }else{
                var item = areaList[key];
                item.key = key;
                returnArr.push(item);
              }
            }
            return res.json(areaList);
          } else {
            return res.json(areaList);
          }
        }, function (errorObject) {
          cosnole.log(errorObject);
          return res.serverError(errorObject.code);
        });
    } else {
      return res.json({});
    }
  },


  /*
* Name: getCountryCode
* Created By: A-SIPL
* Created Date: 01-feb-2018
* Purpose: get country code
* @param  type
*/
  getCountryCode: function (req, res) {
    if (req.body.id) {
      const ref = db.ref('countries/' + req.body.id)
        .once("value", function (snapshot) {
          country = snapshot.val();
          if (country != null && Object.keys(country).length) {
            return res.json(country.code);
          } else {
            return res.json({});
          }
        }, function (errorObject) {
          return res.serverError(errorObject.code);
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
    var ref = db.ref("cities/" + req.params.id);
    ref.once("value", function (snapshot) {
      var cities = snapshot.val();
      if (cities != null) {
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
      } else {
        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('city');
      }
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
            'modified_at': Date.now(),
          }).then(function () {
          if (status == true) {
            /* Update the location status */
            var ref = db.ref('locations');
            ref.orderByChild("city_id").equalTo(req.param('city_id')).once("value", function (citySnapshot) {
            }).then(function (citySnapshot) {
              var cityArray = citySnapshot.val();
              if (cityArray != null && Object.keys(cityArray).length) {
                for (var key in cityArray) {
                  db.ref('locations/' + key)
                    .update({
                      'is_deleted': true,
                      'modified_at': Date.now(),
                    }).then(function () {
                  }).catch(function (err) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
                    return res.redirect('city');
                  });
                }
              }
            }).catch(function (err) {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
              return res.redirect('city');
            });
          }

        }).then(function () {
          var ref = db.ref("suppliers").orderByChild('city_id').equalTo(req.param('city_id'));
          ref.once("value", function (snapshot) {
            var suppliers = snapshot.val();
            if(suppliers != null){
              for (var key in suppliers) {
                db.ref('suppliers/' + key).update({
                  'city_name': req.param('city'),
                  'modified_at': Date.now()
                }).then(function () {

                }, function (errorObject) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
                  return res.redirect('city');
                });
              }
            }
          }, function (errorObject) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
            return res.redirect('city');
          });
        }).then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.city_edit_success + '</div>');
          return res.redirect('city');
        })
          .catch(function (err) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
            return res.redirect('city');
          });
      }
    } else {
      var ref = db.ref("cities/" + req.params.id);
      ref.once("value", function (snapshot) {
        var cities = snapshot.val();
        if (cities != null) {
          /* city listing*/
          var ref = db.ref("countries");
          ref.orderByChild("is_deleted").equalTo(false)
            .once("value", function (snapshot) {
              var countries = snapshot.val();
              return res.view('view-edit-city', {
                title: sails.config.title.edit_city,
                'cities': cities,
                'countries': countries,
                'errors': {},
                'isEdit': true,
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
        } else {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect('city');
        }
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
                    'locations': locations,
                    'cities': cities,
                    countries: countries,
                    errors: errors,
                    isEdit: true,
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
      } else {
        var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
        var ref = db.ref();
        var usersRef = ref.child('locations/' + req.params.id);
        usersRef.update({
          name: req.param('area'),
          city_id: req.param('city'),
          latitude: req.param('latitude'),
          longitude: req.param('longitude'),
          modified_at: Date.now(),
          is_deleted: status
        }).then(function () {
          var ref = db.ref("suppliers").orderByChild('area_id').equalTo(req.params.id);
          ref.once("value", function (snapshot) {
            var suppliers = snapshot.val();
            if(suppliers != null){
              for (var key in suppliers) {
                db.ref('suppliers/' + key).update({
                  'city_name': req.param('area'),
                  'modified_at': Date.now()
                }).then(function () {
                }, function (errorObject) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
                  return res.redirect('city');
                });
              }
            }
          }, function (errorObject) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.city_edit_error + '</div>');
            return res.redirect('city');
          });
        }).then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.location_edit_success + '</div>');
          return res.redirect('city/view/' + req.param('city'));
        })
          .catch(function (err) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.location_edit_error + '</div>');
            return res.redirect('city/view/' + req.param('city'));
          });
      }
    } else {
      var errors = {};
      var ref = db.ref("locations/" + req.params.id);
      ref.once("value", function (snapshot) {
        var locations = snapshot.val();
        if (locations != null) {
          var ref = db.ref("cities");
          ref.once("value", function (snapshot) {
            var cities = snapshot.val();
            /* city listing*/
            var ref = db.ref("countries");
            ref.once("value", function (snapshot) {
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
        } else {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect('city');
        }
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
          'is_deleted': (status == 'true' || status == true) ? true : false,
          'modified_at': Date.now(),
        })
        .then(function () {
          if (status == true || status == "true") {
            /* Update the location status */
            var ref = db.ref('locations');
            ref.orderByChild("city_id").equalTo(req.body.id).once("value", function (citySnapshot) {
            }).then(function (citySnapshot) {
              var cityArray = citySnapshot.val();
              if (cityArray != null && Object.keys(cityArray).length) {
                for (var key in cityArray) {
                  db.ref('locations/' + key)
                    .update({
                      'is_deleted': true,
                      'modified_at': Date.now(),
                    }).then(function () {
                    return res.json({'status': true, message: sails.config.flash.update_successfully});
                  }).catch(function (err) {
                    return res.json({'status': true, message: sails.config.flash.update_successfully});
                  });
                }
              }
            }).catch(function (err) {
              res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
            });
          } else {
            return res.json({'status': true, message: sails.config.flash.update_successfully});
          }
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
          'is_deleted': (status == 'true' || status == true) ? true : false,
          'modified_at': Date.now(),
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
   * Name: delete
   * Created By: A-SIPL
   * Created Date: 20-feb-2018
   * Purpose: delete city
   * @param  req
   */
  delete: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('suppliers').orderByChild("city_id").equalTo(id)
        .once("value", function (snapshot) {
          var supplierResult = snapshot.val();
          if (supplierResult != null) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.can_not_delete_city + '</div>');
            res.json({'status': false, message: sails.config.flash.can_not_delete_city});
          } else {
            db.ref('/cities/' + id)
              .remove()
              .then(function () {
                req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                return res.json({'status': true, message: sails.config.flash.delete_successfully});
              })
              .catch(function (err) {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                res.json({'status': false, message: sails.config.flash.something_went_wronge});
              });
          }
        }, function (errorObject) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },

  /*
 * Name: delete
 * Created By: A-SIPL
 * Created Date: 20-feb-2018
 * Purpose: delete location
 * @param  req
 */
  deleteLocation: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('suppliers').orderByChild("area_id").equalTo(id)
        .once("value", function (snapshot) {
          var supplierResult = snapshot.val();
          if (supplierResult != null) {
            req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.can_not_delete_area + '</div>');
            res.json({'status': false, message: sails.config.flash.can_not_delete_area});
          } else {
            db.ref('/locations/' + id)
              .remove()
              .then(function () {
                req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
                return res.json({'status': true, message: sails.config.flash.delete_successfully});
              })
              .catch(function (err) {
                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                res.json({'status': false, message: sails.config.flash.something_went_wronge});
              });
          }
        }, function (errorObject) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },
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
      return b.created_at - a.created_at;
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
      return b.created_at - a.created_at;
    })
    return locations;
  } else {
    locations = {}
    return locations;
  }
}

