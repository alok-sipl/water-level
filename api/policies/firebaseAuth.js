/**
 * firebaseAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user over firebase
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function firebaseAuth(req, res, next) {
  var firebaseAuth = sails.config.globals.firebaseAuth();
  firebaseAuth.auth().onAuthStateChanged(function (user) {
    if (user) {
      sails.config.globals.userDetail = {
        "name": user.displayName,
        "email": user.email,
        "image": user.photoURL,
        "id": user.uid,
      };
      return next();
    } else {
      sails.config.globals.userDetail = {}
      return res.redirect(sails.config.base_url + 'login');
    }
  })
};
