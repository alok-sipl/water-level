/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.globals.html
 */
module.exports.globals = {

  /****************************************************************************
   *                                                                           *
   * Expose the lodash installed in Sails core as a global variable. If this   *
   * is disabled, like any other node module you can always run npm install    *
   * lodash --save, then var _ = require('lodash') at the top of any file.     *
   *                                                                           *
   ****************************************************************************/

  // _: true,

  /****************************************************************************
   *                                                                           *
   * Expose the async installed in Sails core as a global variable. If this is *
   * disabled, like any other node module you can always run npm install async *
   * --save, then var async = require('async') at the top of any file.         *
   *                                                                           *
   ****************************************************************************/

  // async: true,

  /****************************************************************************
   *                                                                           *
   * Expose the sails instance representing your app. If this is disabled, you *
   * can still get access via req._sails.                                      *
   *                                                                           *
   ****************************************************************************/

  // sails: true,

  /****************************************************************************
   *                                                                           *
   * Expose each of your app's services as global variables (using their       *
   * "globalId"). E.g. a service defined in api/models/NaturalLanguage.js      *
   * would have a globalId of NaturalLanguage by default. If this is disabled, *
   * you can still access your services via sails.services.*                   *
   *                                                                           *
   ****************************************************************************/

  // services: true,

  /****************************************************************************
   *                                                                           *
   * Expose each of your app's models as global variables (using their         *
   * "globalId"). E.g. a model defined in api/models/User.js would have a      *
   * globalId of User by default. If this is disabled, you can still access    *
   * your models via sails.models.*.                                           *
   *                                                                           *
   ****************************************************************************/

  // models: true

  /****************************************************************************
   *                                                                           *
   * This is the firebase setting for the use the firebase data. For live      *
   * account we need to change the json file and database url                  *
   *                                                                           *
   ****************************************************************************/
  firebasedb: firebasedb,
  firebaseAuth: firebaseAuth,
  storageBucket: storageBucket,
  firebaseAdmin: firebaseAdmin
  //getAdminNotification: getAdminNotification,
};

/*
     * Name: firebasedb
     * Created By: A-SIPL
     * Created Date: 16-dec-2017
     * Purpose: create a firebase connection with api credentail and sccess it to globally
     */
function firebasedb() {
  var waterLevelApp = require("firebase-admin");
  var serviceAccount = require('./../serviceAccountKey.json');
  if (!waterLevelApp.apps.length) {
    waterLevelApp.initializeApp({
      credential: waterLevelApp.credential.cert(serviceAccount),
      databaseURL: "https://waterleveldetector-db2b3.firebaseio.com"
    });
  }
  var db = waterLevelApp.database();
  return db;
}


function firebaseAdmin() {
  var admin = require("firebase-admin");
  var serviceAccount = require('./../serviceAccountKey.json');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: alokApp.credential.cert(serviceAccount),
      databaseURL: "https://waterleveldetector-db2b3.firebaseio.com"
    });
  }
  return admin;
}

/*
     * Name: firebaseAuth
     * Created By: A-SIPL
     * Created Date: 16-dec-2017
     * Purpose: create a firebase authentication and access it to globally
     */
function firebaseAuth() {
  var firebaseAuth = require("firebase");
  var config = {
    apiKey: "AIzaSyCf8FWItY_h43oS9KfJdvcDrvULZ3xLx0E",
    authDomain: "waterleveldetector-db2b3.firebaseapp.com",
    databaseURL: "https://waterleveldetector-db2b3.firebaseio.com",
    storageBucket: "waterleveldetector-db2b3.appspot.com",
  };
  if (!firebaseAuth.apps.length) {
    firebaseAuth.initializeApp(config);
  }
  return firebaseAuth;
}

/*
     * Name: storageBucket
     * Created By: A-SIPL
     * Created Date: 04-jan-2018
     * Purpose: create a firebase authentication and access it to globally
     */
function storageBucket() {
  const googleStorage = require('@google-cloud/storage');
  const storage = googleStorage({
    projectId: "waterleveldetector-db2b3",
    keyFilename: "serviceAccountKey.json"
  });
  return bucket = storage.bucket("waterleveldetector-db2b3.appspot.com");
}
