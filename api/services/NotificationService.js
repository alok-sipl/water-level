// api/services/MailerService.js

module.exports.
        sendNotification = function (obj) {
            console.log('I m hererr');
            var FCM = require('fcm-push');
            var fcm = new FCM('AIzaSyDqMXMWEYzoBgYxa37ha6RSB28x7urxKKI');
//            var message = {
//                to: "dSaEJznjcRs:APA91bE2QwN7URJIa5-NgkhTqBoHtnvpYxy7kJ5TNY_sy-Wf9GDR9lGjOeYc-aSDhs7Bk6xybgbSuNdjyhk_U7LTdTawn7UG02Tki2kGPK-RuDdbOI6yiThVKsQOJFPLlGTtHyr-biV0",
//                data: {
//                    userId: "123",
//                    type: "type1",
//                    title: "Raj",
//                    body: "his is just for testing",
//                    badge: 1,
//                    messageData: "Just for testing"
//                },
//                notification: {
//                    title: 'Title of your push notification',
//                    body: 'Body of your push notification'
//                }
//            }
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
                    body: obj.body
                }
            }
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("error==");
                    console.log(err);
                    res.send(err);

                } else {
                    console.log("response == ");
                    console.log(response);
                    res.send(response);

                }

            });
        }
