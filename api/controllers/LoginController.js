/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var validator = require('validator');
var firebase = require("firebase");
var firebaseAuth = sails.config.globals.firebaseAuth();
var db = sails.config.globals.firebasedb();

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 14-dec-2017
     * Purpose: login page for admin
     */
  index: function (req, res) {
    var isFormError = false;
    var errors = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
      }else{
        var config = {
          apiKey: "AIzaSyBvVFWJVMh6F76cm4aY-qmIs4u1ksS-I9E",
          authDomain: "water-level-detector.firebaseapp.com",
          databaseURL: "https://water-level-detector.firebaseio.com",
          storageBucket: "firebase.storage.appspot.com",
        };
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        firebase.auth().signInWithEmailAndPassword(req.param('email'), req.param('password'))
          .then(function (user) {
            req.session.authenticated= true;
            req.session.user = user;
            return res.redirect(sails.config.base_url+'supplier');
          }).catch(function (error) {
            if(error.code == "auth/invalid-email"){
              req.flash('flashMessage', '<div class="alert alert-danger">'+ User.message.email_valid +'</div>');
            }else if(error.code == "auth/invalid-email"){
              req.flash('flashMessage', '<div class="alert alert-danger">'+ sails.config.flash.invalid_email_password +'</div>');
            }else{
              req.flash('flashMessage', '<div class="alert alert-danger">'+ sails.config.flash.invalid_email_password +'</div>');
            }
          return res.redirect(sails.config.base_url+'login');
        });
      }
    }
    if(req.method == "GET" || isFormError){
      res.locals.layout = 'layout-login';
      return res.view('login', {title: sails.config.title.login, errors: errors});
    }
  },


  /*
     * Name: signUp
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: update profile
     * @param  req
     */
  signUp: function (req, res) {
    firebase.auth().createUserWithEmailAndPassword('rahul.khandel@systematixindia.com', '123456')
      .then(function () {
        user = firebase.auth().currentUser;
      }).then(function (){
        user.updateProfile({
          displayName: "Durgesh",
          photoURL: 'http://localhost:1337/images/profile.png'
        });
      }).then(function (){
        var ref = db.ref().child("users");
        var data = {
          email: 'rahul.khandel@systematixindia.com',
          password: '123456',
          name: "Rahul Khandelwal",
          account_number: 6304544275,
          area: "Mari Mata Square",
          city_id: "-L0E-tknbeJKkXDSQHzr",
          city_name: "CL",
          country_id: "-L0E-tknbeJKkXDSQHzr",
          country_name: "United States",
          is_online: true,
          is_admin: true,
          phone: "9713997998",
          id: user.uid,
          is_deleted: false,
          is_user_notification: true,
          is_device_notification: true,
          created_at: Date.now(),
          modified_at: Date.now(),
        }
        console.log('Created');

      ref.push(data).then(function (ref) {//use 'child' and 'set' combination to save data in your own generated key
          req.flash('flashMessage', '<div class="alert alert-success">Admin Created Successfully.</div>');
          return res.redirect(sails.config.base_url+'login');
        }, function (error) {
          req.flash('flashMessage', '<div class="alert alert-danger">Error In Creating Admin.</div>');
          return res.redirect(sails.config.base_url+'login');
         });
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
      });
  },
};

