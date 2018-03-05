// api/services/MailerService.js

module.exports = {
  /*
     * Name: sendWelcomeMail
     * Created By: A-SIPL
     * Created Date: 24-jan-2018
     * Purpose: for signup email
     */
  sendWelcomeMail: function (obj) {
    sails.hooks.email.send(
      "signup", {name: obj.name, email: obj.email, subject: obj.subject, isAdmin : (obj.isAdmin != undefined) ? true : false }, {
        to: obj.email,
        subject: obj.subject
      },
      function (err) {
        console.log(err || "Mail Sent!");
      }
    )
  },

  /*
     * Name: sendForgotPasswordMail
     * Created By: A-SIPL
     * Created Date: 24-jan-2018
     * Purpose: for forgot paasword mail
     */
  sendForgotPasswordMail: function (obj) {
    sails.hooks.email.send(
      "forgotpassword", {name: obj.name, email: obj.email, subject: obj.subject}, {
        to: obj.email,
        subject: obj.subject
      },
      function (err) {
        console.log(err || "Mail Sent!");
      }
    )
  }
}
