/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();
var validator = require('validator');

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: dashboard of the user
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('dashboard', {title: local.title.dashboard});
  },

  /*
     * Name: profile
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: update profile
     * @param  req
     */
  profile: function (req, res) {
    var isFormError = false;
    var errors = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
      }
    }
    if (req.method == "GET" || isFormError) {
      /* user details*/
      var user = {};
      var countries = {};
      var cities = {};
      /* user detail */
      var ref = db.ref("users/-L0UbCoAiFk06mBEYfDZ");
      ref.on("value", function (snapshot) {
        var user = snapshot.val();
        /* country listing*/
        var ref = db.ref("countries");
        ref.on("value", function (snapshot) {
          var countries = snapshot.val();
          /* city listing*/
          var ref = db.ref("cities");
          ref.on("value", function (snapshot) {
            var cities = snapshot.val();
            return res.view('profile', {'user': user, "countries": countries, "cities": cities, "errors": errors});
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
   * Name: changePassword
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: chnage password of admin
   * @param  req
   */
  changePassword: function (req, res) {
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        return res.view('profile', {'user': user, "errors": errors});
      }else{
        var user = firebaseAuth.auth().currentUser;
        if(user){
          var credentials = firebaseAuth.auth.EmailAuthProvider.credential(
            user.email,
            req.param('current_password')
          );
          user.reauthenticateWithCredential(credentials).then(function() {
            user.updatePassword(req.param('new_password')).then(function() {
              req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.password_change_success + '</div>');
              return res.redirect(sails.config.base_url + 'dashboard/changePassword');
            }).catch(function(error) {
              req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.password_change_error + '</div>');
              return res.redirect(sails.config.base_url + 'dashboard/changePassword');
            });
          }).catch(function(error) {
            console.log("Error:- ", error);
            req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.old_password_unmatch + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/changePassword');
          });
        }else{
          return res.redirect(sails.config.base_url + 'login');
        }
      }
    }else{
      return res.view('change-password', {"errors": errors});
    }
  },


  /*
     * Name: logout
     * Created By: A-SIPL
     * Created Date: 13-dec-2017
     * Purpose: for  logout the admin
     * @param  req
     */
  logout: function (req, res) {
    firebaseAuth.auth().signOut()
      .then(function () {
        return res.redirect(sails.config.base_url + 'login');
      })
      .catch(function (error) {
        console.log(error);
      });
  },


  /*
     * Name: setting
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: for  notification setting of admin
     * @param  req
     */
  setting: function (req, res){
    //if(sails.config.globals.userDetail !== undefined){
      /* admin detail */
      var ref = db.ref("users/-L0nFNJX_yF-PdNw5MnD");
      ref.on("value", function (snapshot) {
        var userDetail = snapshot.val();
        if(userDetail){
          return res.view('notification-setting', {userDetail: userDetail});
        }else{
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'dashboard/setting');
        }
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    // }else{
    //   return res.redirect(sails.config.base_url + 'login');
    // }
  },


  /*
     * Name: updateSetting
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: for  notification setting of admin
     * @param  req
     */
  updateSetting: function (req, res){
    console.log("param:-", req.body.value, req.body.type);return false;

    if(req.body.type != undefined && req.body.value != undefined && (req.body.value === true || req.body.value === false)) {
      var index = (req.body.type == 'is_device_notification') ? "is_device_notification" : "is_user_notification";
      db.ref('users/-L0nFNJX_yF-PdNw5MnD')
        .update({
          index : req.body.value,
          modified_date: Date.now(),
        }).then(function (ref) {
        console.log('Success');
      }).error(function (error) {
        console.log('Error:-', error);
      });
    }else{

    }
  }
};

