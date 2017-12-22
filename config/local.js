/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system: for example, this would be a good place
 * to store database or email passwords that apply only to you, and shouldn't
 * be shared with others in your organization.
 *
 * These settings take precedence over all other config files, including those
 * in the env/ subfolder.
 *
 * PLEASE NOTE:
 *		local.js is included in your .gitignore, so if you're using git
 *		as a version control solution for your Sails app, keep in mind that
 *		this file won't be committed to your repository!
 *
 *		Good news is, that means you can specify configuration for your local
 *		machine in this file without inadvertently committing personal information
 *		(like database passwords) to the repo.  Plus, this prevents other members
 *		of your team from commiting their local configuration changes on top of yours.
 *
 *    In a production environment, you probably want to leave this file out
 *    entirely and leave all your settings in env/production.js
 *
 *
 * For more information, check out:
 * http://sailsjs.org/#!/documentation/anatomy/myApp/config/local.js.html
 */

module.exports = {

  /***************************************************************************
   * Your SSL certificate and key, if you want to be able to serve HTTP      *
   * responses over https:// and/or use websockets over the wss:// protocol  *
   * (recommended for HTTP, strongly encouraged for WebSockets)              *
   *                                                                         *
   * In this example, we'll assume you created a folder in your project,     *
   * `config/ssl` and dumped your certificate/key files there:               *
   ***************************************************************************/

  // ssl: {
  //   ca: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl_gd_bundle.crt'),
  //   key: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.key'),
  //   cert: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.crt')
  // },

  /***************************************************************************
   * The `port` setting determines which TCP port your app will be           *
   * deployed on.                                                            *
   *                                                                         *
   * Ports are a transport-layer concept designed to allow many different    *
   * networking applications run at the same time on a single computer.      *
   * More about ports:                                                       *
   * http://en.wikipedia.org/wiki/Port_(computer_networking)                 *
   *                                                                         *
   * By default, if it's set, Sails uses the `PORT` environment variable.    *
   * Otherwise it falls back to port 1337.                                   *
   *                                                                         *
   * In env/production.js, you'll probably want to change this setting       *
   * to 80 (http://) or 443 (https://) if you have an SSL certificate        *
   ***************************************************************************/

  // port: process.env.PORT || 1337,

  /***************************************************************************
   * The runtime "environment" of your Sails app is either typically         *
   * 'development' or 'production'.                                          *
   *                                                                         *
   * In development, your Sails app will go out of its way to help you       *
   * (for instance you will receive more descriptive error and               *
   * debugging output)                                                       *
   *                                                                         *
   * In production, Sails configures itself (and its dependencies) to        *
   * optimize performance. You should always put your app in production mode *
   * before you deploy it to a server.  This helps ensure that your Sails    *
   * app remains stable, performant, and scalable.                           *
   *                                                                         *
   * By default, Sails sets its environment using the `NODE_ENV` environment *
   * variable.  If NODE_ENV is not set, Sails will run in the                *
   * 'development' environment.                                              *
   ***************************************************************************/

   // environment: process.env.NODE_ENV || 'development'

   app_name: 'Water Level Detector',
   base_url: 'https://water-level.herokuapp.com/',
   admin_url: 'https://water-level.herokuapp.com/admin',
   google_key: "AIzaSyDKqiSzlWOyPDonL16HF3xHeFXRtgwKOKU" ,

  /* Validation message setting */
  length:{
    name: 65,
    company_name: 125,
    account_number: 10,
    min_mobile_number: 1,
    max_mobile_number: 13,
    address: 125,
    email: 125,
    min_password: 6,
    max_password: 16,
    device_id: 32,
    max_file_upload: 4000000
  },

  regex:{
    name: /^([ \\'-.A-Za-z\u0600-\u06FF]{1,50})$/,
    alpha_numeric: "^[a-zA-Z0-9]*$",
    mobile_number: /^(\+\d{1,3}[- ]?)?\d{10}$/,
    device_id: /^[a-zA-Z0-9_]*$/
  },

  title:{
    dashboard: 'Dashboard',
    profile: 'Profile',
    add_country: 'Add Country',
    add_city: 'Add City',
    add_location: 'Add Location',
    notification_setting: 'Notification Setting'
  },

  flash:{
    invalid_email_password:"Invalid email or/and password",
    image_not_upload : "No file was uploaded",
    incorrect_file_format : "File type is not supported!",
    email_already_exist: " email already registered",
    password_change_success: "Password changed successfully",
    password_change_error: "Error in changed password",
    old_password_unmatch: "Incorrect current password",
    something_went_wronge: "Something went wronge",
  },
};
