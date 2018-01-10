/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /*
* Name: addCity
* Created By: A-SIPL
* Created Date: 13-dec-2017
* Purpose: add new city location
* @param  type
*/
  addCities: function (req, res) {
    async.waterfall([
      function (cb) {
        var ref = db.ref();
        var cities = ref.child("cities");
        var newCities = cities.push();
        newCities.set({
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Indore',
          is_deleted: false
        });
      }
    ])
  },

  /*
  * Name: addLocations
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addLocations: function (req, res) {
    async.waterfall([
      function (cb) {
        var ref = db.ref();
        var locations = ref.child("locations");
        var newLocations = locations.push();
        newLocations.set({
          city_id: "-L0xTMeRAbBDb1DZhwpc",
          name: 'Dewas',
          is_deleted: false
        });
      }
    ])
  },


  /*
* Name: addLikes
* Created By: A-SIPL
* Created Date: 27-dec-2017
* Purpose: add likes on supplier
* @param  type
*/
  addLikes: function (req, res) {
    var ref = db.ref();
    var likes = ref.child("likes");
    var newLocations = likes.push();
    newLocations.set({
      user_id: "-L0UbCoAiFk06mBEYfDZ",
      supplier_id: "-L12NuoTcIk4d7WfNa6k"
    });
  },


  /*
* Name: deviceReading
* Created By: A-SIPL
* Created Date: 28-dec-2017
* Purpose: add reading data
* @param  type
*/
  deviceReading: function (req, res) {
    var ref = db.ref();
    var likes = ref.child("device_reading");
    var newLocations = likes.push();
    newLocations.set({
      device_id: "-L0oJuC3wNmUAnuic-or",
      reading: "20",
      created_date: Date.now()
    });
  },


  like: function (req, res) {
    db.ref('/users').orderByChild('name')
      .startAt('Alok')
      .endAt("Alok\uf8ff")
      .once('value')
      .then(function (snapshot) {
        console.log(snapshot.val());
      });
  },


  orderBy: function (req, res) {
    db.ref('/countries')
      .orderByChild("name")
      .limitToFirst(2)
      .once('value')
      .then(function (snapshot) {
        console.log(snapshot.val());
      });
  },

  count: function (req, res) {
    db.ref('/countries')
      .once('value')
      .then(function (snapshot) {
        console.log(snapshot.numChildren());
      });
  },


  /*
  * Name: addUser
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addUser: function (req, res) {
    async.waterfall([
      function (cb) {
        var ref = db.ref();
        var locations = ref.child("users");
        var newLocations = locations.push();
        newLocations.push({
          account_number: "2234522586",
          area: 'Dewas',
          city_id: "-L0Ik_goeeUdNOKTJ_DB",
          country_id: "-L0E-tknbeJKkXDSQHzr",
          createdAt: 1512749459933,
          email: "abc@gmail.com",
          isOnline: true,
          name: "SS",
          password: "123456",
          phone: "99999922222"
        });
      }
    ])
  },


  /*
  * Name: addSupplier
  * Created By: A-SIPL
  * Created Date: 13-dec-2017
  * Purpose: add new city location
  * @param  type
  */
  addSupplier: function (req, res) {
    async.waterfall([
      function (cb) {
        var ref = db.ref();
        var locations = ref.child("suppliers");
        locations.push({
          account_number: "2234522586",
          area: 'Dewas',
          country_name: "India",
          city_name: "Indore",
          city_id: "-L0xTMeRAbBDb1DZhwpc",
          country_id: "-L0xTMeRAbBDb1DZhwpc",
          created_date: 1513774149199,
          modified_date: 1513774149199,
          company_name: "Himalay",
          email: "himalay@gmail.com",
          is_deleted: false,
          name: "Himalay",
          mobile_number: "9713997998"
        });
      }
    ])
  },

  /*
 * Name: paggination
 * Created By: A-SIPL
 * Created Date: 26-dec-2017
 * Purpose: Update status of city
 * @param  req
 */
  paggination: function (req, res) {
    const adminNew = require('firebase-admin');
    var serviceAccount = require("./../../serviceAccountKey.json");
    if (!adminNew.apps.length) {
      adminNew.initializeApp({
        credential: adminNew.credential.cert(serviceAccount),
        databaseURL: "https://water-level-detector.firebaseio.com"
      });
    }
    var db = adminNew.firestore();
    //return db;


    var first = db.collection('suppliers')
      .orderBy('company_name')
      .limit(3);
    console.log('Response->', first.get());


    // var paginate = first.get()
    //   .then(function (snapshot) {
    //     // ...
    //     // Get the last document
    //     var last = snapshot.docs[snapshot.docs.length - 1];
    //     console.log('last.data->', last.data());
    //     // Construct a new query starting at this document.
    //     // Note: this will not have the desired effect if multiple
    //     // cities have the exact same population value.
    //     var next = db.collection('suppliers')
    //       .orderBy('company_name')
    //       .startAfter(last.data().company_name)
    //       .limit(3);
    //     console.log('Next Response->', next);
    //     // Use the query for pagination
    //     // ...
    //   });
  },


  /*
 * Name: paggination
 * Created By: A-SIPL
 * Created Date: 26-dec-2017
 * Purpose: Update status of city
 * @param  req
 */
  fcm: function (req, res) {
    var FCM = require('fcm-push');
    var fcm = new FCM('AIzaSyCf8FWItY_h43oS9KfJdvcDrvULZ3xLx0E');
    var message = {
      to: 'dSaEJznjcRs:APA91bE2QwN7URJIa5-NgkhTqBoHtnvpYxy7kJ5TNY_sy-Wf9GDR9lGjOeYc-aSDhs7Bk6xybgbSuNdjyhk_U7LTdTawn7UG02Tki2kGPK-RuDdbOI6yiThVKsQOJFPLlGTtHyr-biV0', // required fill with device token or topics
      data: {
        your_custom_data_key: 'demo'
      },
      notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
      }
    };

    //callback style
    fcm.send(message, function(err, response){
      if (err) {
        console.log("Something has gone wrong!", err);
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });

  },

  fileUpload: function (req, res) {


    const storage = googleStorage({
      projectId: "water-level-detector",
      keyFilename: "serviceAccountKey.json"
    });
    const bucket = storage.bucket("water-level-detector.appspot.com");
    bucket.upload('http://10.10.100.19:1337/images/logo.png', function(err, file) {
      if (!err) {
        console.log("saved success");
        console.log('Response',file);
        // "zebra.jpg" is now in your bucket.
      }else{
        console.log(err);
      }
    });
  }

};

