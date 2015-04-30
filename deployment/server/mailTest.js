/*jslint node:true*/

"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    bodyParser = require('body-parser'),
    sys = require('sys'),
    exec = require('child_process').exec,
    app = express(),
    child,
    config = require('../../server/config/config.js')['deployment'];


var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.user,
        pass: config.password
    }
});

var subject = "Test results";

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
// setup e-mail data with unicode symbols
var mailOptions = {
    from: config.userName + " <" + config.user + ">", // sender address
    to: config.to, // list of receivers
    subject: subject, // Subject line
    text: 'text', // plaintext body 'Hello world ✔'
    html: 'html',// html body
    attachments: [
        {
            filename: "mailTest.js",
            path: "./mailTest.js"
        }
    ]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});
