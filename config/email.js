//config/email.js

module.exports.email = {
  service: "Gmail",
  auth: {
    user: 'ravi_sipl@systematixindia.com',
    pass: '********'
  },
  templateDir: "views/email-template",
  from: 'ravi_sipl@systematixindia.com',
  testMode: false,
  ssl: true
}
