/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var storageBucket = sails.config.globals.storageBucket();

module.exports = {
    /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: sjpw grid page
     * @param  req
     */
    index: function (req, res) {
        return res.view('user-listing', {
            'title': sails.config.title.user_list
        });
    },

    /*
     * Name: userlist
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: shpw grid with data
     * @param  req
     */
    userlist: function (req, res) {
        /* country listing*/
        users = [];
        var ref = db.ref("users");
        ref.orderByChild("is_admin").equalTo(false).once('value', function (snap) {
            var userJson = (Object.keys(snap).length) ? getUserList(snap) : {};
            return res.json({'rows': userJson});
        });
    },

    /*
     * Name: view
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: shpw grid with data
     * @param  req
     */
    view: function (req, res) {
        /* user detail */
        var errors = {};
        var ref = db.ref("users/" + req.params.id);
        ref.once("value", function (snapshot) {
            var user = snapshot.val();
            /* city listing*/
            var ref = db.ref("countries");
            ref.orderByChild("is_deleted").equalTo(false)
            .once("value", function (snapshot) {
                var countries = snapshot.val();
                return res.view('view-edit-user', {
                    'title': sails.config.title.view_user,
                    'user': user, errors: errors,
                    'countries': countries,
                    'isEdit': false,
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
     * Created Date: 20-dec-2017
     * Purpose: shpw grid with data
     * @param  req
     */
    edit: function (req, res) {
        if (req.method == "POST") {
            errors = ValidationService.validate(req);
            if (Object.keys(errors).length) {
                var ref = db.ref("users/" + req.params.id);
                ref.once("value", function (snapshot) {
                    var user = snapshot.val();
                    if (user != undefined) {
                        /* city listing*/
                        var ref = db.ref("countries");
                        ref.orderByChild("is_deleted").equalTo(false)
                        .once("value", function (snapshot) {
                            var countries = snapshot.val();
                            return res.view('view-edit-user', {
                                'title': sails.config.title.edit_user,
                                'user': user,
                                'errors': errors,
                                'countries': countries,
                                'isEdit': true,
                            });
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
                    } else {
                        return res.serverError();
                    }
                }, function (errorObject) {
                    return res.serverError(errorObject.code);
                });
            } else {
                var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
                req.file('image').upload({
                    dirname: sails.config.base_url + 'assets/images',
                    // don't allow the total upload size to exceed ~4MB
                    maxBytes: sails.config.length.max_file_upload
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        var ref = db.ref("users/" + req.params.id);
                        ref.once("value", function (snapshot) {
                            var user = snapshot.val();
                            if (user != undefined) {
                                /* city listing*/
                                var ref = db.ref("countries");
                                ref.orderByChild("is_deleted").equalTo(false)
                                .once("value", function (snapshot) {
                                    var countries = snapshot.val();
                                    return res.view('view-edit-user', {
                                        'title': sails.config.title.edit_user,
                                        'user': user,
                                        'errors': errors,
                                        'countries': countries,
                                        'isEdit': true,
                                    });
                                }, function (errorObject) {
                                    return res.serverError(errorObject.code);
                                });
                            } else {
                                return res.serverError();
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
                    }
                    if (uploadedFiles.length === 0) {
                        var status = (req.param('status') == "false") ? false : true
                        var ref = db.ref("users/" + req.params.id);
                        ref.once("value", function (snapshot) {
                            var user = snapshot.val();
                            if (user != undefined) {
                                var ref = db.ref();
                                db.ref('users/' + req.params.id)
                                        .update({
                                            'name': req.param('name'),
                                            'account_number': req.param('account_number'),
                                            'country_id': req.param('country'),
                                            'country_name': req.param('country_name'),
                                            'city_id': req.param('city'),
                                            'city_name': req.param('city_name'),
                                            'area': req.param('area'),
                                            'latitude': parseFloat(req.param('latitude')),
                                            'longitude': parseFloat(req.param('longitude')),
                                            'is_deleted': status
                                        })
                                        .then(function (res) {
                                            if (status != user.is_deleted) {
                                                MailerService.sendWelcomeMail({
                                                    name: user.name,
                                                    email: user.email,
                                                    subject: (status == false) ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
                                                });
                                            }
                                        })
                                        .then(function (res) {
                                            req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                                            return res.redirect(sails.config.base_url + 'user');
                                        })
                                        .catch(function (err) {
                                            console.log("in error-->", err);
                                            req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.user_edit_error + '</div>');
                                            return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                                        });
                            } else {
                                return res.serverError();
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
                    } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                        errors['image'] = {message: WaterSupplier.message.invalid_file}
                        var ref = db.ref("users/" + req.params.id);
                        ref.once("value", function (snapshot) {
                            var user = snapshot.val();
                            if (user != undefined) {
                                /* city listing*/
                                var ref = db.ref("countries");
                                ref.orderByChild("is_deleted").equalTo(false)
                                .once("value", function (snapshot) {
                                    var countries = snapshot.val();
                                    return res.view('view-edit-user', {
                                        'title': sails.config.title.edit_user,
                                        'user': user,
                                        'errors': errors,
                                        'countries': countries,
                                        'isEdit': true,
                                    });
                                }, function (errorObject) {
                                    return res.serverError(errorObject.code);
                                });
                            } else {
                                return res.serverError();
                            }
                        }, function (errorObject) {
                            return res.serverError(errorObject.code);
                        });
                    } else {
                        storageBucket.upload(uploadedFiles[0].fd, function (err, file) {
                            if (!err) {
                                var status = (req.param('status') == "false") ? false : true
                                var ref = db.ref("users/" + req.params.id);
                                ref.once("value", function (snapshot) {
                                    var user = snapshot.val();
                                    if (user != undefined) {
                                        var ref = db.ref();
                                        const file = storageBucket.file(uploadedFiles[0].fd);
                                        return file.getSignedUrl({
                                            action: 'read',
                                            expires: '03-09-2491'
                                        }).then(function (signedUrls) {
                                            db.ref('users/' + req.params.id)
                                                    .update({
                                                        'name': req.param('name'),
                                                        'account_number': req.param('account_number'),
                                                        'country_id': req.param('country'),
                                                        'country_name': req.param('country_name'),
                                                        'city_id': req.param('city'),
                                                        'city_name': req.param('city_name'),
                                                        'area': req.param('area'),
                                                        'latitude': parseFloat(req.param('latitude')),
                                                        'longitude': parseFloat(req.param('longitude')),
                                                        'is_deleted': status,
                                                        'image': signedUrls[0],
                                                        'modified_date': Date.now(),
                                                    })
                                                    .then(function (res) {
                                                        if (status != user.is_deleted) {
                                                            MailerService.sendWelcomeMail({
                                                                name: user.name,
                                                                email: user.email,
                                                                subject: (status == false) ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
                                                            });
                                                        }
                                                    })
                                                    .then(function (res) {
                                                        req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.user_edit_success + '</div>');
                                                        return res.redirect(sails.config.base_url + 'user');
                                                    })
                                                    .catch(function (err) {
                                                        console.log("in error-->", err);
                                                        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.user_edit_error + '</div>');
                                                        return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                                                    });
                                        }).catch(function (err) {
                                            console.log("in error-->", err);
                                            req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.user_edit_error + '</div>');
                                            return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                                        });
                                    } else {
                                        return res.serverError();
                                    }
                                }, function (errorObject) {
                                    return res.serverError(errorObject.code);
                                });

                            } else {
                                req.flash('flashMessage', '<div class="alert alert-danger">' + err + '</div>');
                                return res.redirect(sails.config.base_url + 'user/edit/' + req.params.id);
                            }
                        });
                    }
                });
            }
        } else {
            /* user detail */
            var errors = {};
            var ref = db.ref("users/" + req.params.id);
            ref.once("value", function (snapshot) {
                var user = snapshot.val();
                /* city listing*/
                var ref = db.ref("countries");
                ref.orderByChild("is_deleted").equalTo(false)
                .once("value", function (snapshot) {
                    var countries = snapshot.val();
                    return res.view('view-edit-user', {
                        'title': sails.config.title.edit_user,
                        'user': user,
                        'errors': errors,
                        'countries': countries,
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
     * Name: updateStatus
     * Created By: A-SIPL
     * Created Date: 26-dec-2017
     * Purpose: UPdate
     * @param  req
     */
    updateStatus: function (req, res) {
        var id = req.body.id;
        var status = req.body.is_active;
        var ref = db.ref('/users/' + id);
        ref.once("value", function (snapshot) {
            if (snapshot.val()) {
                db.ref('/users/' + id)
                        .update({
                            'is_deleted': status
                        })
                        .then(function (res) {
                            userinfo = snapshot.val();
                            MailerService.sendWelcomeMail({
                                name: userinfo.name,
                                email: userinfo.email,
                                subject: (status == true || status == 'true') ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
                            });
                        })
                        .then(function () {
                            return res.json({'status': true, message: sails.config.flash.update_successfully});
                        })
                        .catch(function (err) {
                            console.log(err)
                            return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
                        });
            } else {
                return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
            }
        }, function (errorObject) {
            return res.json({'status': false, 'message': sails.config.flash.something_went_wronge});
        });
    },
};

/*
 * Name: getUserList
 * Created By: A-SIPL
 * Created Date: 20-dec-2017
 * Purpose: sget the user grid dat
 * @param  req
 */
function getUserList(snap) {
    if (Object.keys(snap).length) {
        snap.forEach(function (childSnap) {
            user = childSnap.val();
            updateUser = user;
            updateUser.user_id = childSnap.key;
            users.push(updateUser);
        });
        users.sort(function (a, b) {
            return b.created_at - a.created_at;
        })
        return users;
    } else {
        users = {}
        return users;
    }
}

