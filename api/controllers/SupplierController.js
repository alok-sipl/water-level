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
      ref.orderByChild('company_name').once("value", function (snapshot) {
        return res.json(formatSnapsort(snapshot));
      }, function (errorObject) {
        return res.json({});
      });
    }).catch(function (err) {
      return res.json({});
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
    //var offset = parseInt(req.body.offset);
    //var limit = parseInt(req.body.limit);
    var text = req.body.text;
    var ref = db.ref("suppliers");
    if (text != '' && text != undefined) {
      ref.orderByChild('company_name')
        .startAt(text)
        .endAt(text + "\uf8ff")
        .once('value')
        .then(function (snapshot) {
          var suppliers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          }).catch(function (err) {
            var suppliers = snapshot.val();
            res.locals.layout = false;
            return res.view('show-supplier', {
              suppliers: {}
            });
          });
        });
    } else {
      ref.orderByChild('company_name')
        .limitToFirst(limit)
        .once("value", function (snapshot) {
          var suppliers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          });
        }).catch(function (err) {
        var suppliers = snapshot.val();
        res.locals.layout = false;
        return res.view('show-supplier', {
          suppliers: {}
        });
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
    var supplier = {};
    var countries = {};
    var cities = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
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
                'errors': errors,
                'req': req
              });
            }
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        var ref = db.ref("/suppliers");
        ref.orderByChild("email").equalTo(req.param('email')).once('value')
          .then(function (snapshot) {
            supplierdata = snapshot.val();
            req.file('company_image').upload({
              saveAs: function (file, handler) {
                handler(null, '../../assets/images' + "/" + file.filename);
              },
              maxBytes: sails.config.length.max_file_upload
            }, function whenDone(err, uploadedFiles) {
              if (err) {
                errors['company_image'] = {message: err}
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
                      'errors': errors,
                      'req': req
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
              } else {
                if (uploadedFiles.length === 0) {
                  errors['company_image'] = {message: WaterSupplier.message.company_image_required}
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
                        'errors': errors,
                        'req': req
                      });
                    }, function (errorObject) {
                      return res.serverError(errorObject.code);
                    });
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  errors['company_image'] = {message: WaterSupplier.message.invalid_file}
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
                        'errors': errors,
                        'req': req
                      });
                    }, function (errorObject) {
                      return res.serverError(errorObject.code);
                    });
                } else if (supplierdata) {
                  req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier/add');
                } else {
                  storageBucket.upload('assets/images/'+uploadedFiles[0].filename, function (err, file) {
                    if (!err) {
                    var ref = db.ref();
                    const file = storageBucket.file(uploadedFiles[0].filename);
                    return file.getSignedUrl({
                      action: 'read',
                      expires: '03-09-2491'
                    }).then(function (signedUrls) {
                      var status = (req.param('status') == "false") ? false : true;
                      var ref = db.ref("suppliers");
                      var data = {
                        company_name: req.param('company_name').trim(),
                        name: req.param('name').trim(),
                        email: req.param('email').trim(),
                        mobile_number: req.param('mobile_number').trim(),
                        account_number: req.param('account_number').trim(),
                        tank_size: req.param('tank_size'),
                        country_id: req.param('country').trim(),
                        country_name: req.param('country_name').trim(),
                        city_id: req.param('city').trim(),
                        city_name: req.param('city_name').trim(),
                        area: req.param('area').trim(),
                        latitude: parseFloat(req.param('latitude')),
                        longitude: parseFloat(req.param('longitude')),
                        is_deleted: status,
                        created_date: Date.now(),
                        modified_date: Date.now(),
                        image: signedUrls[0],
                      }
                      ref.push(data).then(function () {
                        req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
                        return res.redirect(sails.config.base_url + 'supplier');
                      }, function (error) {
                        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_add_error + '</div>');
                        return res.redirect(sails.config.base_url + 'supplier');
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
                }
              }
            });
          }).catch(function (err) {
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
                return res.view('add-update-supplier', {
                  title: sails.config.title.edit_supplier,
                  'supplier': supplier,
                  "countries": countries,
                  "cities": cities,
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
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        req.file('company_image').upload({
          saveAs: function (file, handler) {
            handler(null, '../../assets/images' + "/" + file.filename);
          },
          //dirname: sails.config.base_url + 'assets/images',
          maxBytes: sails.config.length.max_file_upload
        }, function whenDone(err, uploadedFiles) {
          if (err) {
            errors['company_image'] = {message: err}
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
                    return res.view('add-update-supplier', {
                      title: sails.config.title.edit_supplier,
                      'supplier': supplier,
                      "countries": countries,
                      "cities": cities,
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
          } else {
            if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
              errors['company_image'] = {message: WaterSupplier.message.invalid_file}
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
                      return res.view('add-update-supplier', {
                        title: sails.config.title.edit_supplier,
                        'supplier': supplier,
                        "countries": countries,
                        "cities": cities,
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
            } else {
              if (uploadedFiles[0] != undefined && uploadedFiles[0] != '') {
                storageBucket.upload('assets/images/'+uploadedFiles[0].filename, function (err, file) {
                  if (!err) {
                  var ref = db.ref();
                  const file = storageBucket.file(uploadedFiles[0].filename);
                  return file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                  }).then(function (signedUrls) {
                    var ref = db.ref();
                    var status = (req.param('status') == "false") ? false : true;
                    db.ref('suppliers/' + req.params.id)
                      .update({
                        'company_name': req.param('company_name').trim(),
                        'name': req.param('name').trim(),
                        'mobile_number': req.param('mobile_number').trim(),
                        'account_number': req.param('account_number').trim(),
                        'tank_size': req.param('tank_size'),
                        'country_id': req.param('country').trim(),
                        'country_name': req.param('country_name').trim(),
                        'city_id': req.param('city').trim(),
                        'city_name': req.param('city_name').trim(),
                        'area': req.param('area').trim(),
                        'image': signedUrls[0],
                        'latitude': parseFloat(req.param('latitude')),
                        'longitude': parseFloat(req.param('longitude')),
                        'is_deleted': status,
                      })
                      .then(function () {
                        req.flash('flashMessage', '<div class="flash-message alert alert-success">' + sails.config.flash.supplier_edit_success + '</div>');
                        return res.redirect(sails.config.base_url + 'supplier');
                      })
                      .catch(function (err) {
                        req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_edit_error + '</div>');
                        return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                      });
                  }).catch(function (err) {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + sails.config.flash.supplier_edit_error + '</div>');
                    return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                  });
                  } else {
                    req.flash('flashMessage', '<div class="flash-message alert alert-danger">' + err + '</div>');
                    return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                  }
                });
              } else {
                var ref = db.ref();
                var status = (req.param('status') == "false") ? false : true
                db.ref('suppliers/' + req.params.id)
                  .update({
                    'company_name': req.param('company_name').trim(),
                    'name': req.param('name').trim(),
                    'mobile_number': req.param('mobile_number').trim(),
                    'account_number': req.param('account_number').trim(),
                    'tank_size': req.param('tank_size'),
                    'country_id': req.param('country').trim(),
                    'country_name': req.param('country_name').trim(),
                    'city_id': req.param('city').trim(),
                    'city_name': req.param('city_name').trim(),
                    'area': req.param('area').trim(),
                    'latitude': parseFloat(req.param('latitude')),
                    'longitude': parseFloat(req.param('longitude')),
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
              }

            }
          }
        });
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
            if(supplier != null){
              /* city name */
              var cityId = (supplier.city_id) ? supplier.city_id : 0;
              var ref = db.ref("cities").orderByChild('country_id').equalTo((supplier.country_id != undefined) ? supplier.country_id : '');
              ref.once("value", function (snapshot) {
                var cities = snapshot.val();
                return res.view('add-update-supplier', {
                  title: sails.config.title.edit_supplier,
                  'supplier': supplier,
                  "countries": countries,
                  "cities": cities,
                  "errors": errors
                });
              }, function (errorObject) {
                return res.serverError(errorObject.code);
              });
            }else{
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
          'is_deleted': (status == 'true') ? true : false
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
