// api/services/MailerService.js

module.exports.
  sendWelcomeMail = function (obj) {
  sails.hooks.email.send(
    "signup",{name: obj.name, email: obj.email, subject: obj.subject, message: 'Hey'}, {
      to: obj.email,
      subject: obj.subject
    },
    function (err) {
      console.log(err || "Mail Sent!");
    }
  )
}
