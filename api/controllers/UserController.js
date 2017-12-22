/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: sjpw grid page
     * @param  req
     */
   index: function (req, res) {
    // var users = {};
    // var countries = {};
    // var cities = {};
    // var subCities = {};
    // /* country listing*/
    // var ref = db.ref("countries");
    // ref.on("value", function (snapshot) {
    //   var countries = snapshot.val();
    //   /* city listing*/
    //   var ref = db.ref("cities");
    //   ref.on("value", function (snapshot) {
    //     var cities = snapshot.val();
    //     /* subcities listing*/
    //     var ref = db.ref("subcities");
    //     ref.on("value", function (snapshot) {
    //       var subCities = snapshot.val();
    //       /* subcities listing*/
    //       var ref = db.ref("users");
    //       ref.on("value", function (snapshot) {
    //         var users = snapshot.val();
    //         return res.view('user-listing', {users: users, countries: countries, cities:cities, subCities:subCities});
    //       }, function (errorObject) {
    //         return res.serverError(errorObject.code);
    //       });
    //     }, function (errorObject) {
    //       return res.serverError(errorObject.code);
    //     });
    //   }, function (errorObject) {
    //     return res.serverError(errorObject.code);
    //   });
    // }, function (errorObject) {
    //   return res.serverError(errorObject.code);
    // });
    return res.view('user-listing');
   },

  /*
   * Name: userlist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  userlist:function(req, res){
    /* country listing*/
    users = [];
    var ref = db.ref("users");
    ref.on('value', function (snap) {
      var userJson     = (Object.keys(snap).length) ? getUserList(snap) : {};
      //console.log('User Data:---', userJson);
      /*var records      =  userJson.length;
      var pages        =  Math.ceil(records/req.query.rows);
      var page  = req.query.page
   //   console.log(req.query.rows);
          return res.json({"records":records,"page":page,"total":pages,'rows':userJson});*/
      return res.json({'rows':userJson});
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
    ref.on("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'user': user, errors: errors,countries: countries, isEdit: false,
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
  edit:function(req, res){
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.on("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.on("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'user': user, errors: errors,countries: countries, isEdit: true,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });

    }, function (errorObject) {
      return res.serverError(errorObject.code);
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
function getUserList(snap){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      user = childSnap.val();
      updateUser = user;
      updateUser.user_id =  childSnap.key;
      users.push(updateUser);
    });
    return users;
  }else{
    users ={}
    return users;
  }
}

