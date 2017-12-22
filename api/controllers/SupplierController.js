/**
 * SupplierController
 *
 * @description :: Server-side logic for managing suppliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('supplier-listing');
  },

  /*
     * Name: addSupplier
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  addSupplier: function (req, res) {
    var isFormError = false;
    var errors = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        var ref = db.ref("/suppliers");
        ref.orderByChild("email").equalTo(req.param('email')).once('value')
          .then(function (snapshot) {
            supplierdata = snapshot.val();
            req.file('company_image').upload({
              // don't allow the total upload size to exceed ~4MB
              maxBytes: sails.config.length.max_file_upload
            }, function whenDone(err, uploadedFiles) {
              if (err) {
                console.log("1111");
                isFormError = true;
                errors['company_image'] = {message: err}
                //req.flash('flashMessage', '<div class="alert alert-danger">' + err + '</div>');
                //return res.redirect(sails.config.base_url + 'supplier/addSupplier');
              } else {
                if (uploadedFiles.length === 0) {
                  console.log("2222");
                  isFormError = true;
                  errors['company_image'] = {message: Supplier.message.company_image_required}
                  //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.image_not_upload + '</div>');
                  //return res.redirect(sails.config.base_url + 'supplier/addSupplier');
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  console.log("3333");
                  isFormError = true;
                  errors['company_image'] = {message: Supplier.message.invalid_file}
                  //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.incorrect_file_format + '</div>');
                  //return res.redirect(sails.config.base_url + 'supplier/addSupplier');
                } else if (supplierdata) {
                  console.log("4444");
                  req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier/addSupplier');
                } else {
                  // Create a root reference
                  // var firebase = require("firebase");
                  // var config = {
                  //   apiKey: "AIzaSyBvVFWJVMh6F76cm4aY-qmIs4u1ksS-I9E",
                  //   authDomain: "water-level-detector.firebaseapp.com",
                  //   databaseURL: "https://water-level-detector.firebaseio.com",
                  //   storageBucket: "water-level-detector.appspot.com",
                  // };
                  // if (!firebase.apps.length) {
                  //   firebase.initializeApp(config);
                  // }
                  // var storageRef = firebase.storage().ref();
                  // var file =  uploadedFiles[0].fd;
                  // storageRef.put(file).then(function(snapshot) {
                  //   console.log('Uploaded a blob or file!');
                  // }).catch(function(error) {
                  //   console.log('In error', error);
                  // });
                  var ref = db.ref().child("suppliers");
                  var data = {
                    company_name: req.param('company_name'),
                    name: req.param('name'),
                    email: req.param('email'),
                    mobile_number: req.param('mobile_number'),
                    account_number: req.param('account_number'),
                    tank_size: req.param('tank_size'),
                    country_id: req.param('country'),
                    country_name: req.param('country_name'),
                    city_id: req.param('city'),
                    city_name: req.param('city_name'),
                    area: req.param('area'),
                    latitude: req.param('latitude'),
                    longitude: req.param('longitude'),
                    is_deleted: false,
                    created_date: Date.now(),
                    modified_date: Date.now(),
                    /*compnay_image: req.param('company_image'),*/
                  }
                  ref.push(data).then(function (ref) {
                    req.flash('flashMessage', '<div class="alert alert-success">Supplier Added Successfully.</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  }, function (error) {
                    req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Supplier.</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  });
                }
                console.log("7777777");
              }
              console.log("888888");
            });
          });
        console.log("999999");
      }
      console.log("0000000");
    }
    if (req.method == "GET" || isFormError) {
      console.log("66666");
      var supplier = {};
      var countries = {};
      /* country listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('add-update-supplier', {
          'supplier': supplier,
          countries: countries,
          "errors": errors,
          req: req
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
     * Name: addSupplier
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  edit: function (req, res) {
    var supplier = {};
    var countries = {};
    var isFormError = false;
    var errors = {};
    if (req.method == "POST") {
      var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
      req.file('company_image').upload({
        // don't allow the total upload size to exceed ~4MB
        maxBytes: sails.config.length.max_file_upload
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          isFormError = true;
          errors['company_image'] = {message: err}
          //req.flash('flashMessage', '<div class="alert alert-danger">' + err + '</div>');
          //return res.redirect(sails.config.base_url + 'supplier/addSupplier');
        } else {
          if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
            isFormError = true;
            errors['company_image'] = {message: Supplier.message.invalid_file}
            //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.incorrect_file_format + '</div>');
            //return res.redirect(sails.config.base_url + 'supplier/addSupplier');
          } else {
            console.log('URL:-', 'suppliers/'+req.params.id);
            db.ref('suppliers/'+req.params.id)
              .update({
                company_name: req.param('company_name'),
                name: req.param('name'),
                mobile_number: req.param('mobile_number'),
                account_number: req.param('account_number'),
                tank_size: req.param('tank_size'),
                country_id: req.param('country'),
                country_name: req.param('country'),
                city_id: req.param('city'),
                city_name: req.param('city'),
                area: req.param('area'),
                latitude: req.param('latitude'),
                longitude: req.param('longitude'),
                modified_date: Date.now(),
              }).then(function (ref) {
                console.log('Success');
            }, function (error) {
              console.log('error');
            }).then(function (error) {
              console.log('error11');
            }, function (error) {
              console.log('error11');
            });
          }
        }
      });
    }
    if (req.method == "GET" || isFormError) {
      /* country listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        /* supplier detail */
        var ref = db.ref("suppliers/" + req.params.id);
        ref.on("value", function (snapshot) {
          var supplier = snapshot.val();
          /* city name */
          var cityId = (supplier.cityId) ? supplier.cityId : 0;
          var ref = db.ref("cities/" + cityId);
          ref.on("value", function (snapshot) {
            var city = snapshot.val();
            return res.view('add-update-supplier', {
              'supplier': supplier,
              "countries": countries,
              "cityName": city.name,
              "errors": errors
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

};

