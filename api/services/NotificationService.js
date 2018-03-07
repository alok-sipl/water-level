// api/services/MailerService.js

module.exports = {
  sendNotification: function (obj, req, res) {
    console.log(obj);
    var FCM = require('fcm-push');
    var fcm = new FCM('AIzaSyDqMXMWEYzoBgYxa37ha6RSB28x7urxKKI');

    var message = {
      to: obj.token,
      data: {
        userId: obj.userId,
        type: obj.type,
        title: obj.title,
        body: obj.body,
        date: (obj.data != undefined) ? obj.data : {},
      },
      notification: {
        title: obj.title,
        body: obj.body,
        sound: 'default',
      }
    }
    fcm.send(message, function (err, response) {
      if (err) {
        console.log('In error', err);

      } else {
        console.log('In success--->', response);
      }
    });
  }
}
