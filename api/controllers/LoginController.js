/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var validator = require('validator');
var firebase = require("firebase");
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();

module.exports = {
    /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 14-dec-2017
     * Purpose: login page for admin
     */
    index: function (req, res) {
        if (!req.session.authenticated) {
            var errors = {};
            /* Checking validation if form post */
            if (req.method == "POST") {
                errors = ValidationService.validate(req);
                if (Object.keys(errors).length) {
                    res.locals.layout = 'layout-login';
                    return res.view('login', {title: sails.config.title.login, errors: errors});
                } else {
                    firebaseAuth.auth().signInWithEmailAndPassword(req.param('email'), req.param('password'))
                            .then(function (user) {
                                var ref = db.ref("users").orderByChild('id').equalTo(user.uid);
                                ref.once("value", function (snapshot) {
                                    var adminDetail = snapshot.val();
                                    var userKey = Object.keys(adminDetail)[0];
                                    if (adminDetail) {
                                        if (adminDetail[userKey].is_admin != undefined && adminDetail[userKey].is_admin == true) {
                                            req.session.authenticated = true;
                                            req.session.user = user;
                                            req.session.userid = (Object.keys(adminDetail)[0]) ? Object.keys(adminDetail)[0] : '';
                                            return res.redirect(sails.config.base_url + 'supplier');
                                        } else {
                                            req.flash('flashMessage', '<div class="alert alert-danger">' + User.message.email_valid + '</div>');
                                            return res.redirect(sails.config.base_url);
                                        }
                                    } else {
                                        req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
                                        return res.redirect(sails.config.base_url);
                                    }
                                }, function (errorObject) {
                                    return res.serverError(errorObject.code);
                                });
                            }).catch(function (error) {
                        if (error.code == "auth/invalid-email") {
                            console.log('111');
                            req.flash('flashMessage', '<div class="alert alert-danger">' + User.message.email_valid + '</div>');
                        } else {
                            console.log('3333');
                            req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.invalid_email_password + '</div>');
                        }
                        return res.redirect(sails.config.base_url + 'login');
                    });
                }
            }
            if (req.method == "GET") {
                res.locals.layout = 'layout-login';
                return res.view('login', {title: sails.config.title.login, errors: errors});
            }
        } else {
            res.redirect('supplier');
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
        if (!req.session.authenticated) {
            firebase.auth().createUserWithEmailAndPassword('admin@qatrah.com', 'admin@1234')
                    .then(function () {
                        user = firebase.auth().currentUser;
                    }).then(function () {
                user.updateProfile({
                    displayName: "Durgesh",
                    photoURL: 'http://localhost:1337/images/profile.png'
                });
            }).then(function () {
                var ref = db.ref().child("users");
                var data = {
                    email: 'admin@qatrah.com',
                    password: 'admin@1234',
                    name: "Sipl Admin",
                    account_number: 6304544275,
                    area: "PU 4 Behind C21 Mall",
                    city_id: "",
                    city_name: "CL",
                    country_id: "-L0E-tknbeJKkXDSQHzr",
                    country_name: "United States",
                    is_online: true,
                    is_admin: false,
                    phone: "9713997998",
                    id: user.uid,
                    is_deleted: false,
                    is_user_notification_enable: true,
                    is_device_notification_enable: true,
                    created_at: Date.now(),
                    modified_at: Date.now(),
                }
                console.log('Created');

                ref.push(data).then(function () {//use 'child' and 'set' combination to save data in your own generated key
                    req.flash('flashMessage', '<div class="alert alert-success">Admin Created Successfully.</div>');
                    return res.redirect(sails.config.base_url + 'login');
                }, function (error) {
                    req.flash('flashMessage', '<div class="alert alert-danger">Error In Creating Admin.</div>');
                    return res.redirect(sails.config.base_url + 'login');
                });
            })
                    .catch(function (error) {
                        req.flash('flashMessage', '<div class="alert alert-danger">Error In Creating Admin.</div>');
                        return res.redirect(sails.config.base_url + 'login');
                    });
        } else {
            res.redirect('supplier');
        }
    },


  filter: function(req, res){
    res.locals.layout = 'layout-filter';
    return res.view('filter', {title: sails.config.title.login, rating : '', _fid : '', name:'', outline:'', runtime:'', director:'', stars: '', year: '', genre:'', is_deleted:''});
  }
};

