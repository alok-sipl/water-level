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
    db.ref('/countries')
      .once('value')
      .then(function (snapshot) {
        supplierCount = snapshot.numChildren();
        var ref = db.ref("suppliers");
        ref.orderByChild('name').limitToFirst(sails.config.per_page_data).once("value", function (snapshot) {
          var suppliers = snapshot.val();
          return res.view('supplier-listing', {
            title: sails.config.title.supplier_list,
            suppliers: suppliers,
            count: supplierCount
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }).catch(function (err) {
      req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
      return res.redirect('supplier');
    });
  },


  /*
     * Name: moreSupplier
     * Created By: A-SIPL
     * Created Date: 27-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  moreSupplier: function (req, res) {
    var offset = parseInt(req.body.offset);
    var limit = parseInt(req.body.limit);
    var text = req.body.text;
    var ref = db.ref("/suppliers");
    if(text != '' && text != undefined){
      ref.orderByChild('name')
        .limitToFirst(limit)
        .startAt(text)
        .endAt(text +"\uf8ff")
        .once('value')
        .then(function (snapshot) {
          var suppliers = snapshot.val();
          console.log("Supplier:--", snapshot.val());
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          });
        });
    }else{
      ref.orderByChild('name')
        .limitToFirst(limit)
        .once("value", function (snapshot) {
          var suppliers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          });
        }, function (errorObject) {
          return '';
        });
    }
  },




  /*
     * Name: add
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  add: function (req, res) {
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
                isFormError = true;
                errors['company_image'] = {message: err}
                //req.flash('flashMessage', '<div class="alert alert-danger">' + err + '</div>');
                //return res.redirect(sails.config.base_url + 'supplier/add');
              } else {
                if (uploadedFiles.length === 0) {
                  isFormError = true;
                  errors['company_image'] = {message: WaterSupplier.message.company_image_required}
                  //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.image_not_upload + '</div>');
                  //return res.redirect(sails.config.base_url + 'supplier/add');
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  isFormError = true;
                  errors['company_image'] = {message: WaterSupplier.message.invalid_file}
                  //req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.incorrect_file_format + '</div>');
                  //return res.redirect(sails.config.base_url + 'supplier/add');
                } else if (supplierdata) {
                  req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier/add');
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
              }
            });
          });
      }
    }
    if (req.method == "GET" || isFormError) {
      var supplier = {};
      var countries = {};
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('add-update-supplier', {
          'title': sails.config.title.add_supplier,
          'supplier': supplier,
          'countries': countries,
          'errors': errors,
          'req': req
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
     * Name: edit
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
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        req.file('company_image').upload({
          // don't allow the total upload size to exceed ~4MB
          maxBytes: sails.config.length.max_file_upload
        }, function whenDone(err, uploadedFiles) {
          if (err) {
            isFormError = true;
            errors['company_image'] = {message: err}
          } else {
            if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
              isFormError = true;
              errors['company_image'] = {message: WaterSupplier.message.invalid_file}
            } else {
              var admin = require("firebase-admin");
              // Fetch the service account key JSON file contents
              var serviceAccount = require('./../../serviceAccountKey.json');
              // Initialize the app with a service account, granting admin privileges
              if (!admin.apps.length) {
                admin.initializeApp({
                  credential: waterLevelApp.credential.cert(serviceAccount),
                  databaseURL: "https://water-level-detector.firebaseio.com"
                });
              }
              var ref = admin.database().ref();
              var usersRef = ref.child('suppliers/-L12VkXpjVX-fVfG47P1');
              usersRef.update({
                'company_name': req.param('company_name')
              });
              return res.redirect('/user');
              //res.json({'ok':'ok'});

              // db.ref('suppliers/' + req.params.id)
              //   .update({
              //     'company_name': req.param('company_name'),
              //     'name': req.param('name'),
              //     'mobile_number': req.param('mobile_number'),
              //     'account_number': req.param('account_number'),
              //     'tank_size': req.param('tank_size'),
              //     'country_id': req.param('country'),
              //     'country_name': req.param('country'),
              //     'city_id': req.param('city'),
              //     'city_name': req.param('city'),
              //     'area': req.param('area'),
              //     'latitude': req.param('latitude'),
              //     'longitude': req.param('longitude')
              //   })
              //   .then(function (res) {
              //     console.error(sails.config.base_url + 'supplier');
              //     req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
              //     return res.redirect(sails.config.base_url + 'supplier');
              //   })
              //   .catch(function (err) {
              //     console.error("In second Error", err);
              //     req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
              //     return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
              //   }).catch(function (err) {
              //   console.error("In second Error", err);
              //   req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
              //   return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
              // });
            }
          }
        });
      }
    }
    if (req.method == "GET" || isFormError) {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        /* supplier detail */
        var ref = db.ref("suppliers/" + req.params.id);
        ref.once("value", function (snapshot) {
          var supplier = snapshot.val();
          /* city name */
          var cityId = (supplier.cityId) ? supplier.cityId : 0;
          var ref = db.ref("cities/" + cityId);
          ref.once("value", function (snapshot) {
            var city = snapshot.val();
            return res.view('add-update-supplier', {
              title: sails.config.title.edit_supplier,
              'supplier': supplier,
              "countries": countries,
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


  /*
     * Name: update
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  update: function (req, res, next) {

    var supplier = {};
    var countries = {};
    var isFormError = false;
    var errors = {};
    errors = ValidationService.validate(req);
    if (Object.keys(errors).length) {
      isFormError = true;
    } else {
      var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
      req.file('company_image').upload({
        // don't allow the total upload size to exceed ~4MB
        maxBytes: sails.config.length.max_file_upload
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          isFormError = true;
          errors['company_image'] = {message: err}
        } else {
          if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
            isFormError = true;
            errors['company_image'] = {message: WaterSupplier.message.invalid_file}
          } else {
            db.ref('suppliers/' + req.params.id)
              .update({
                'company_name': req.param('company_name'),
                'name': req.param('name'),
                'mobile_number': req.param('mobile_number'),
                'account_number': req.param('account_number'),
                'tank_size': req.param('tank_size'),
                'country_id': req.param('country'),
                'country_name': req.param('country'),
                'city_id': req.param('city'),
                'city_name': req.param('city'),
                'area': req.param('area'),
                'latitude': req.param('latitude'),
                'longitude': req.param('longitude')
              })
              .then(function (res) {
                console.error(sails.config.base_url + 'supplier');
                req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
                return res.redirect(sails.config.base_url + 'supplier');
              })
              .catch(function (err) {
                console.error("In second Error", err);
                req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
                return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
              }).catch(function (err) {
              console.error("In second Error", err);
              req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
              return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
            });
          }
        }
      });
    }

  },


  updateSupplier: function (req, res, next) {

    var ref = db.ref();
    var usersRef = ref.child("users/-L0UbCoAiFk06mBEYfDZ");
    usersRef.update({name: 'ravi Llllwqw'});
    return res.redirect('/user');
    //res.json({'ok':'ok'});

  }
};

