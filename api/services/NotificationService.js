// api/services/MailerService.js


module.exports = {
  /*
   * Name: sendNotification
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: send push notifiocation service
   * @param  req
   */
    sendNotification : function (obj, req, res) {
        var FCM = require('fcm-push');
        var fcm = new FCM('AIzaSyDqMXMWEYzoBgYxa37ha6RSB28x7urxKKI');

        var message = {
            to: obj.token,
            data: {
                userId: obj.userId,
                type: obj.type,
                title: obj.title,
                body: obj.body,
            },
            notification: {
                title: obj.title,
                body: obj.body,
                sound: 'default',
            }
        }
        fcm.send(message, function (err, response) {
            if (err) {
                console.log(err);

            } else {
                console.log(response);
            }
        });
    },


}
