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

     //port: process.env.PORT || 1337,

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

    app_name: 'Qatrah',
    base_url: 'https://water-level.herokuapp.com/',
    base_url_js: 'https://water-level.herokuapp.com',
    //base_url: 'http://localhost:1337/',
    //base_url_js: 'http://localhost:1337',
    google_key: "AIzaSyDKqiSzlWOyPDonL16HF3xHeFXRtgwKOKU",
    admin_email: 'ravi_sipl@systematixindia.com',
    authentication_email: 'ravi_sipl@systematixindia.com',
    authentication_password: 'target@2015',
    per_page_data: 3,
    supplier_range: 80,
    min_battery_level: 16,
    min_device_battery_level: 10,
    device_reading_alert_time: 1,
    notification_limit : 5,
    password_link_expired_min : 60,

    /* Validation message setting */
    length: {
        name: 30,
        company_name: 70,
        account_number: 10,
        min_mobile_number: 10,
        max_mobile_number: 13,
        address: 125,
        city: 40,
        email: 70,
        min_password: 6,
        max_password: 16,
        device_id: 17,
        device_id_iphone: 36,
        max_file_upload: 4194304,
        max_file_upload_kb: 4194,
    },

    regex: {
        name: /^(?!\s)([ \\'A-Za-z\u0600-\u06FF]{2,30})$/,
        company_name: /^(?!\s)([ \\'-.&A-Za-z\u0600-\u06FF]{1,70})$/,
        alpha_numeric: "^[a-zA-Z0-9]*$",
        mobile_number: /^[-+]?(\+\d{1,3}[-]?)?[\d ]{9,13}$/,
        device_id: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        device_id_iphone: /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/,
        lat_long: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
    },

    title: {
        login: 'Admin Login',
        dashboard: 'Dashboard',
        profile: 'Profile',
        edit_profile: 'Edit Profile',
        change_password: 'Change password',
        admin_list: 'Admin List',
        add_admin: 'Add Admin',
        edit_admin: 'Edit Admin',
        view_admin: 'View Admin',
        supplier_list: 'Supplier List',
        add_supplier: 'Add Supplier',
        edit_supplier: 'Edit Supplier',
        view_supplier: 'View Supplier',
        user_list: 'User List',
        edit_user: 'Edit User',
        view_user: 'View User',
        add_admin: 'Add Admin',
        edit_admin: 'Edit Admin',
        view_admin: 'View Admin',
        device_list: 'Device List',
        add_device: 'Add Device',
        edit_device: 'Edit Device',
        view_device: 'View Device',
        add_country: 'Add Country',
        edit_country: 'Edit Country',
        city_list: 'City List',
        add_city: 'Add City',
        edit_city: 'Edit City',
        location_list: 'Area List',
        add_location: 'Add Area',
        edit_location: 'Edit Area',
        enquiry_list: 'Contact Enquiry List',
        view_enquiry: 'View Enquiry',
        notification_setting: 'Notification Setting',
        forgot_password: "Forgot password",
        set_new_passwors: "Set new password",
        alert_list: "Alert List",

    },

    flash: {
        invalid_email_password: "Invalid email or password",
        image_not_upload: "No file was uploaded",
        incorrect_file_format: "File type is not supported!",
        email_already_exist: " email already registered",
        email_already_exist_in_admin: " email already registered for admin",
        email_already_exist_in_user: " email already registered for user",
        password_change_success: "Password changed successfully",
        password_change_error: "Error in changed password",
        password_set_success: "Password set successfully",
        password_set_error: "Error in set password",
        old_password_unmatch: "Incorrect current password",
        something_went_wronge: "Something went wronge",
        update_successfully: "Status updated successfully",
        delete_successfully: "Record deleted successfully",
        supplier_add_success: "Supplier added successfully",
        supplier_add_error: "Error in adding supplier",
        supplier_edit_success: "Supplier updated successfully",
        supplier_edit_error: "Error in updating supplier",
        admin_add_success: "Admin added successfully",
        admin_add_error: "Error in adding admin",
        admin_edit_success: "Admin updated successfully",
        admin_edit_error: "Error in updating admin",
        device_add_success: "Device added successfully",
        device_add_error: "Error in adding device",
        device_edit_success: "Device updated successfully",
        device_edit_error: "Error in updating device",
        device_already_exist: " device already registered",
        city_add_success: "City added successfully",
        city_add_error: "Error in adding city",
        city_edit_success: "City updated successfully",
        city_edit_error: "Error in updating city",
        location_add_success: "Area added successfully",
        location_add_error: "Error in adding area",
        location_edit_success: "Area updated successfully",
        location_edit_error: "Error in updating area",
        user_edit_success: "User updated successfully",
        user_edit_error: "Error in updating user",
        profile_update_success: "Profile update successfully",
        profile_update_error: "Error in updating profile",
        paramter_missing: "Required parameter is mising",
        invalid_email: "This email is not registered",
        account_inactive: "Your account is inactived by admin",
        forgot_mail_send_success: "We have sent mail please check email and follow the steps",
        same_password_warning: "Current password and new password cannot be same",
        can_not_delete_city: "You can't delete this city because it is added with supplier",
        can_not_delete_area: "You can't delete this area because it is added with supplier",

    },

    email_message: {
        user_activated: "Your account has been activated by admin",
        user_deactivated: "Your account has been deactivated by admin",
        device_activated: "Your device has been activated by admin",
        device_deactivated: "Your device has been deactivated by admin",
        forgot_password: 'Forgot password link',
        new_admin: "Your email is registerd for Qatrah admin"
    }

};
