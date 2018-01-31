// api/services/MailerService.js

var crypto = require('crypto');

module.exports = {

  /* encrypt setting */
  algorithm: 'aes-256-ctr',
  password: 'sipl1234567890',

  /*
   * Name: encrypt
   * Created By: A-SIPL
   * Created Date: 28-jan-2018
   * Purpose: encrpt the text
   * @param  text
   */
  encrypt: function (text) {
    var cipher = crypto.createCipher('aes-256-ctr', 'sipl1234567890')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  },

  /*
   * Name: decrypt
   * Created By: A-SIPL
   * Created Date: 28-jan-2018
   * Purpose: decrypt the text
   * @param  text
   */
  decrypt: function (text) {
    var decipher = crypto.createDecipher('aes-256-ctr', 'sipl1234567890')
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }


}
