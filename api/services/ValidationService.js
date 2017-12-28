var validator = require('validator');
module.exports = {
  /* Check input validation for from all fields */
  validate: function (req) {
    var errors = {};
    var old = {};
    if (req.param('name') != undefined) {
      if (validator.isEmpty(req.param('name'))) {
        errors['name'] = {message: User.message.name_required}
      } else if (validator.isLength(req.param('name', {min: 0, max: sails.config.length.name}))) {
        errors['name'] = {message: User.message.name_maxlength}
      } else if (!validator.matches(req.param('name'), sails.config.regex.name)) {
        errors['name'] = {message: User.message.name_pattern}
      }
    }
    if (req.param('email') != undefined) {
      if (validator.isEmpty(req.param('email'))) {
        errors['email'] = {message: User.message.email_required}
      } else if (validator.isLength(req.param('email', {min: 0, max: sails.config.length.email}))) {
        errors['email'] = {message: User.message.email_maxlength}
      } else if (!validator.isEmail(req.param('email'))) {
        errors['email'] = {message: User.message.email_valid}
      }
    }
    if (req.param('password') != undefined) {
      if (validator.isEmpty(req.param('password'))) {
        errors['password'] = {message: User.message.password_required}
      } else if (validator.isLength(req.param('password', {
          min: sails.config.length.min_password,
          max: sails.config.length.max_password
        }))) {
        errors['password'] = {message: User.message.password_maxlength}
      }
    }
    if (req.param('current_password') != undefined) {
      if (validator.isEmpty(req.param('current_password'))) {
        errors['current_password'] = {message: User.message.current_password_required}
      } else if (validator.isLength(req.param('current_password', {
          min: sails.config.length.min_password,
          max: sails.config.length.max_password
        }))) {
        errors['current_password'] = {message: User.message.current_password_maxlength}
      }
    }
    if (req.param('new_password') != undefined) {
      if (validator.isEmpty(req.param('new_password'))) {
        errors['new_password'] = {message: User.message.new_password_required}
      } else if (validator.isLength(req.param('new_password', {
          min: sails.config.length.min_password,
          max: sails.config.length.max_password
        }))) {
        errors['new_password'] = {message: User.message.new_password_maxlength}
      }else if (req.param('confirm_password') != req.param('new_password')) {
        errors['new_password'] = {message: User.message.password_not_same}
      }
    }
    if (req.param('confirm_password') != undefined) {
      if (validator.isEmpty(req.param('confirm_password'))) {
        errors['confirm_password'] = {message: User.message.confirm_password_required}
      } else if (validator.isLength(req.param('confirm_password', {
          min: sails.config.length.min_password,
          max: sails.config.length.max_password
        }))) {
        errors['confirm_password'] = {message: User.message.confirm_password_maxlength}
      }
    }
    if (req.param('mobile_number') != undefined) {
      if (validator.isEmpty(req.param('mobile_number'))) {
        errors['mobile_number'] = {message: User.message.mobile_number_required}
      } else if (validator.isLength(req.param('mobile_number', {
          min: sails.config.length.min_mobile_number,
          max: sails.config.length.max_mobile_number
        }))) {
        errors['mobile_number'] = {message: User.message.mobile_number_maxlength}
      } else if (!validator.matches(req.param('mobile_number'), sails.config.regex.mobile_number)) {
        errors['mobile_number'] = {message: User.message.mobile_number_pattern}
      }
    }
    if (req.param('account_number') != undefined) {
      if (validator.isLength(req.param('account_number', {
          min: sails.config.length.account_number,
          max: sails.config.length.account_number
        }))) {
        errors['account_number'] = {message: User.message.account_number_length}
      } else if (!validator.isAlphanumeric(req.param('account_number'))) {
        errors['account_number'] = {message: User.message.account_number_alphanumeric}
      }
    }
    if (req.param('country') != undefined) {
      if (validator.isEmpty(req.param('country'))) {
        errors['country'] = {message: User.message.country_required}
      }
    }
    if (req.param('city') != undefined) {
      if (validator.isEmpty(req.param('city'))) {
        errors['city'] = {message: User.message.city_required}
      }
    }
    if (req.param('area') != undefined) {
      if (validator.isEmpty(req.param('area'))) {
        errors['area'] = {message: User.message.area_required}
      } else if (validator.isLength(req.param('area', {max: sails.config.length.address}))) {
        errors['area'] = {message: User.message.area_length}
      }
    }
    if (req.param('latitude') != undefined) {
      if (validator.isEmpty(req.param('latitude')) || validator.isEmpty(req.param('longitude')) || isNaN(req.param('latitude')) || isNaN(req.param('longitude')) || req.param('latitude') < -90 || req.param('latitude') > 90 || req.param('longitude') < -180 || req.param('longitude') > 180) {
        errors['area'] = {message: User.message.area_selection}
      }
    }
    if (req.param('device_id') != undefined) {
      if (validator.isEmpty(req.param('device_id'))) {
        errors['device_id'] = {message: Device.message.device_id_required}
      } else if (validator.isLength(req.param('device_id', {min: sails.config.length.device_id, max: sails.config.length.device_id}))) {
        errors['device_id'] = {message: Device.message.device_id_size}
      } else if (!validator.matches(req.param('device_id'), sails.config.regex.name)) {
        errors['device_id'] = {message: Device.message.device_id_pattern}
      }
    }
    return errors;
  },

  getDistanceFromLatLonInKm : function (lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1))  Math.cos(this.deg2rad(lat2)) 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  },
  deg2rad : function (deg) {
    return deg * (Math.PI/180)
  },
}
