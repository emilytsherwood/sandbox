// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
// Export these awesome routes
var nodemailer = require('nodemailer');
var express = require('express');
var key = require('../keys.js');
module.exports = function (app) {
    app.post('/send', function (req, res, next) {
        // db.UserPost.findOne({
        //     where: {
        //         : req.body.email
        //     }
        // });
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'sandbox.for.devs@gmail.com',
                pass: key.password
            }
        });
        var mailOptions = {
            from: "John Doe <johndoe@outlook.com",
            to: 'maximevanbel@gmail.com',
            subject: 'You are in a new Group',
            text: 'You have now joined a new group. Here are your peers...',
            html: '<p>This is an official email from Sandbox Dev!</p><p>Your group topic is: </p>' + '"'+req.body.email+'"'+ '<p>The other members of your group: </p>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.redirect('/');
            } else {
                console.log('Message Sent');
                res.redirect('/');
            }
        });
    });
};