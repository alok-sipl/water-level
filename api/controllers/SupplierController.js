/**
 * SupplierController
 *
 * @description :: Server-side logic for managing suppliers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();
var storageBucket = sails.config.globals.storageBucket();

module.exports = {
  /*
   * Name: index
   * Created By: A-SIPL
   * Created Date: 8-dec-2017
   * Purpose: show listing of the supplier
   * @param  int  $id
   */
  index: function (req, res) {
    db.ref('suppliers')
      .once('value')
      .then(function (snapshot) {
        supplierCount = snapshot.numChildren();
        var ref = db.ref("suppliers");
        ref.orderByChild('company_name').once("value", function (snapshot) {
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
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.redirect('supplier');
    });
  },


  /*
   * Name: getSupplier
   * Created By: A-SIPL
   * Created Date: 20-Jan-2018
   * Purpose: sget all supplier
   * @param  int  $id
   */
  getSupplier: function (req, res) {
    locations = [];
    cities = [];
    db.ref('suppliers').once('value').then(function (snapshot) {
      supplierCount = snapshot.numChildren();
      var ref = db.ref("suppliers");
      ref.orderByChild('company_name').limitToLast(supplierCount).once("value", function (snapshot, previousChildKey) {
        return res.json(formatSnapsort(snapshot));
      }, function (errorObject) {
        return res.json({});
      });
    }).catch(function (err) {
      return res.json({});
    });
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
    var errors = supplier = countries = cities = areas = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        console.log('In error');
        /* country listing*/
        var ref = db.ref("countries");
        ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            var countries = snapshot.val();
            if (req.param('city') != '') {
              var ref = db.ref("cities");
              ref.orderByChild("country_id").equalTo(req.param('country')).once("value", function (snapshot) {
                var cities = snapshot.val();
                return res.view('add-update-supplier', {
                  'title': sails.config.title.add_supplier,
                  'supplier': supplier,
                  'countries': countries,
                  'cities': cities,
                  'areas': areas,
                  'errors': errors,
                  'req': req
                });
              }, function (errorObject) {
                return res.serverError(errorObject.code);
              });
            } else {
              return res.view('add-update-supplier', {
                'title': sails.config.title.add_supplier,
                'supplier': supplier,
                'countries': countries,
                'cities': cities,
                'areas': areas,
                'errors': errors,
                'req': req
              });
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
      } else {
        console.log('In process');
        var ref = db.ref("suppliers");
        ref.orderByChild("email").equalTo(req.param('email')).once('value')
          .then(function (snapshot) {
            supplierdata = snapshot.val();
            console.log('Old supplier detail--->',supplierdata);
            if (supplierdata == null) {
              console.log('Supplier not exist');
              if (req.body.image != undefined && req.body.image[0] != undefined) {
                console.log('Image upload');
                var imagepath = req.body.image[0];
                var base64Data = imagepath.replace(/^data:image\/png;base64,/, "");
                var imagename = Date.now() + '.png';
                var imagePath = "assets/images/" + imagename;
                require("fs").writeFile(imagePath, base64Data, 'base64', function (err) {
                  console.log('In file write');
                  if (err == null) {
                    console.log('Not in file write error');
                    storageBucket.upload(imagePath, function (err, file) {
                      console.log('In storage bucket');
                      if (!err) {
                        console.log('Not in storage bucket error');
                        var ref = db.ref();
                        const file = storageBucket.file(imagename);
                        return file.getSignedUrl({
                          action: 'read',
                          expires: '03-09-2491'
                        }).then(function (signedUrls) {
                          console.log('Final upload then');
                          var ref = db.ref("locations");
                          ref.orderByChild("city_id").equalTo(req.param('city'))
                            .once("child_added", function (snapshot) {
                              var area = snapshot.val();
                              var latitude = (area.latitude) ? area.latitude : '0';
                              var longitude = (area.longitude) ? area.longitude : '0';
                              var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
                              var ref = db.ref("suppliers");
                              var company_name = req.param('company_name').trim()
                              var data = {
                                company_name: company_name.charAt(0).toUpperCase() + company_name.slice(1),
                                name: req.param('name').trim(),
                                email: req.param('email').trim(),
                                mobile_number: req.param('mobile_number').trim(),
                                account_number: req.param('account_number').trim(),
                                tank_size: req.param('tank_size'),
                                country_id: req.param('country').trim(),
                                country_name: req.param('country_name').trim(),
                                city_id: req.param('city').trim(),
                                city_name: req.param('city_name').trim(),
                                area_id: req.param('area').trim(),
                                area_name: req.param('area_name').trim(),
                                latitude: parseFloat(latitude),
                                longitude: parseFloat(longitude),
                                is_deleted: status,
                                created_at: Date.now(),
                                modified_at: Date.now(),
                                image: signedUrls[0],
                              }
                              ref.push(data).then(function () {
                                req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
                                return res.redirect(sails.config.base_url + 'supplier');
                              }, function (error) {
                                req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                                return res.redirect(sails.config.base_url + 'supplier');
                              });
                            }, function (errorObject) {
                              return res.serverError(errorObject.code);
                            });
                        }).catch(function (err) {
                          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                          return res.redirect(sails.config.base_url + 'supplier');
                        });
                      } else {
                        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + err + '</div>');
                        return res.redirect(sails.config.base_url + 'supplier');
                      }
                    });
                  } else {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  }
                });
              } else {
                console.log('Image not uploaded');
                var ref = db.ref("locations");
                ref.orderByChild("city_id").equalTo(req.param('city'))
                  .once("child_added", function (snapshot) {
                    var area = snapshot.val();
                    var latitude = (area.latitude) ? area.latitude : '0';
                    var longitude = (area.longitude) ? area.longitude : '0';
                    var status = (req.param('status') == "false" || req.param('status') == false) ? false : true;
                    var ref = db.ref("suppliers");
                    var company_name = req.param('company_name').trim()
                    var data = {
                      company_name: company_name.charAt(0).toUpperCase() + company_name.slice(1),
                      name: req.param('name').trim(),
                      email: req.param('email').trim(),
                      mobile_number: req.param('mobile_number').trim(),
                      account_number: req.param('account_number').trim(),
                      tank_size: req.param('tank_size'),
                      country_id: req.param('country').trim(),
                      country_name: req.param('country_name').trim(),
                      city_id: req.param('city').trim(),
                      city_name: req.param('city_name').trim(),
                      area_id: req.param('area').trim(),
                      area_name: req.param('area_name').trim(),
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                      is_deleted: status,
                      created_at: Date.now(),
                      modified_at: Date.now(),
                      image: sails.config.base_url + 'images/no-image.png',
                    }
                    ref.push(data).then(function () {
                      req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
                      return res.redirect(sails.config.base_url + 'supplier');
                    }, function (error) {
                      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                      return res.redirect(sails.config.base_url + 'supplier');
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
              }
            }else {
              console.log('Supplier already');
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'supplier/add');
            }
          }).catch(function (err) {
          console.log('In error 111', err);
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'supplier');
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.orderByChild("is_deleted").equalTo(false)
        .once("value", function (snapshot) {
          var countries = snapshot.val();
          return res.view('add-update-supplier', {
            'title': sails.config.title.add_supplier,
            'supplier': supplier,
            'countries': countries,
            'cities': cities,
            'areas': areas,
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
        /* country listing*/
        var ref = db.ref("countries");
        ref.orderByChild("is_deleted").equalTo(false)
          .once("value", function (snapshot) {
            var countries = snapshot.val();
            /* supplier detail */
            var ref = db.ref("suppliers/" + req.params.id);
            ref.once("value", function (snapshot) {
              var supplier = snapshot.val();
              /* city name */
              var cityId = (supplier.city_id) ? supplier.city_id : 0;
              var ref = db.ref("cities").orderByChild('country_id').equalTo((supplier.country_id != undefined) ? supplier.country_id : '');
              ref.once("value", function (snapshot) {
                var cities = snapshot.val();
                /* get area */
                var cityId = (supplier.area_id) ? supplier.area_id : 0;
                var ref = db.ref("locations").orderByChild('city_id').equalTo(cityId);
                ref.once("value", function (snapshot) {
                  var areas = snapshot.val();
                  return res.view('add-update-supplier', {
                    title: sails.config.title.edit_supplier,
                    'supplier': supplier,
                    "countries": countries,
                    "cities": cities,
                    "areas": areas,
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
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
      } else {
        if (req.body.image != undefined && req.body.image[0] != undefined) {
          var imagepath = req.body.image[0];
          var base64Data = imagepath.replace(/^data:image\/png;base64,/, "");
          var imagename = Date.now() + '.png';
          var imagePath = "assets/images/" + imagename;
          require("fs").writeFile(imagePath, base64Data, 'base64', function (err) {
            if (err == null) {
              storageBucket.upload(imagePath, function (err, file) {
                if (!err) {
                  var ref = db.ref();
                  const file = storageBucket.file(imagename);
                  return file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                  }).then(function (signedUrls) {
                  var ref = db.ref("locations");
                  ref.orderByChild("city_id").equalTo(req.param('city'))
                    .once("child_added", function (snapshot) {
                      var area = snapshot.val();
                      var latitude = (area.latitude) ? area.latitude : '0';
                      var longitude = (area.longitude) ? area.longitude : '0';
                      var ref = db.ref();
                      var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
                      var company_name = req.param('company_name').trim()
                      db.ref('suppliers/' + req.params.id)
                        .update({
                          'company_name': company_name.charAt(0).toUpperCase() + company_name.slice(1),
                          'name': req.param('name').trim(),
                          'mobile_number': req.param('mobile_number').trim(),
                          'account_number': req.param('account_number').trim(),
                          'tank_size': req.param('tank_size'),
                          'country_id': req.param('country').trim(),
                          'country_name': req.param('country_name').trim(),
                          'city_id': req.param('city').trim(),
                          'city_name': req.param('city_name').trim(),
                          'area_id': req.param('area').trim(),
                          'area_name': req.param('area_name').trim(),
                          'latitude': parseFloat(latitude),
                          'longitude': parseFloat(longitude),
                          'image': signedUrls[0],
                          'is_deleted': status,
                        })
                        .then(function () {
                          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_edit_success + '</div>');
                          res.redirect('supplier');
                        })
                        .catch(function (err) {
                          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_edit_error + '</div>');
                          res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                        });
                    }, function (errorObject) {
                      return res.serverError(errorObject.code);
                    });
                  }).catch(function (err) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  });
                } else {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + err + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier');
                }
              });
            } else {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
              return res.redirect(sails.config.base_url + 'supplier');
            }
          });
        } else {
          var ref = db.ref("locations");
          ref.orderByChild("city_id").equalTo(req.param('city'))
            .once("child_added", function (snapshot) {
              var area = snapshot.val();
              var latitude = (area.latitude) ? area.latitude : '0';
              var longitude = (area.longitude) ? area.longitude : '0';
              var ref = db.ref();
              var status = (req.param('status') == "false" || req.param('status') == false) ? false : true
              var company_name = req.param('company_name').trim()
              db.ref('suppliers/' + req.params.id)
                .update({
                  'company_name': company_name.charAt(0).toUpperCase() + company_name.slice(1),
                  'name': req.param('name').trim(),
                  'mobile_number': req.param('mobile_number').trim(),
                  'account_number': req.param('account_number').trim(),
                  'tank_size': req.param('tank_size'),
                  'country_id': req.param('country').trim(),
                  'country_name': req.param('country_name').trim(),
                  'city_id': req.param('city').trim(),
                  'city_name': req.param('city_name').trim(),
                  'area_id': req.param('area').trim(),
                  'area_name': req.param('area_name').trim(),
                  'latitude': parseFloat(latitude),
                  'longitude': parseFloat(longitude),
                  'is_deleted': status,
                })
                .then(function () {
                  req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_edit_success + '</div>');
                  res.redirect('supplier');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_edit_error + '</div>');
                  res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          }
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.orderByChild("is_deleted").equalTo(false)
        .once("value", function (snapshot) {
          var countries = snapshot.val();
          /* supplier detail */
          var ref = db.ref("suppliers/" + req.params.id);
          ref.once("value", function (snapshot) {
            var supplier = snapshot.val();
            if (supplier != null) {
              /* city name */
              var cityId = (supplier.city_id) ? supplier.city_id : 0;
              var ref = db.ref("cities").orderByChild('country_id').equalTo((supplier.country_id != undefined) ? supplier.country_id : '');
              ref.once("value", function (snapshot) {
                var cities = snapshot.val();
                /* get area */
                var areaId = (supplier.area_id) ? supplier.area_id : 0;
                var ref = db.ref("locations").orderByChild('city_id').equalTo(cityId);
                ref.once("value", function (snapshot) {
                  var areas = snapshot.val();
                  return res.view('add-update-supplier', {
                    title: sails.config.title.edit_supplier,
                    'supplier': supplier,
                    "countries": countries,
                    "cities": cities,
                    "areas": areas,
                    "errors": errors
                  });
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
              }, function (errorObject) {
                return res.serverError(errorObject.code);
              });
            } else {
              req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
              res.redirect(sails.config.base_url + 'supplier');
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
    }
  },

  /*
   * Name: updateStatus
   * Created By: A-SIPL
   * Created Date: 8-dec-2017
   * Purpose: add new supplier
   * @param  req
   */
  updateStatus: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('/suppliers/' + id)
        .update({
          'is_deleted': (status == 'true' || status == true) ? true : false
        })
        .then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.update_successfully + '</div>');
          return res.json({'status': true, message: sails.config.flash.update_successfully});
        })
        .catch(function (err) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          res.json({'status': false, message: sails.config.flash.something_went_wronge});
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
   * Purpose: delete supplier
   * @param  req
   */
  delete: function (req, res) {
    var id = req.body.id;
    var status = req.body.is_active;
    if (id != '') {
      db.ref('/suppliers/' + id)
        .remove()
        .then(function () {
          req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.delete_successfully + '</div>');
          return res.json({'status': true, message: sails.config.flash.delete_successfully});
        })
        .catch(function (err) {
          req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
      return res.json({'status': false, message: sails.config.flash.something_went_wronge});
    }
  },

  date: function (req, res) {
    return res.json({});
  },
};

/*
   * Name: formatSnapsort
   * Created By: A-SIPL
   * Created Date: 20-jan-2018
   * Purpose: sget the user grid dat
   * @param  req
   */
function formatSnapsort(snap) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      updateLocation = childSnap.val();
      updateLocation.id = childSnap.key;
      locations.push(updateLocation);
    });
    return locations;
  } else {
    locations = {}
    return locations;
  }
}
