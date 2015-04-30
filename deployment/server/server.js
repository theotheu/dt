/*jslint node:true*/

"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sys = require('sys'),
    exec = require('child_process').exec,
    app = express(),
    child,
    config = require('../../server/config/config.js')['deployment'],
    testConfig = require('../../server/config/config.js')['test'],
    acceptanceConfig = require('../../server/config/config.js')['acceptance']
    ;

// Configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));     // Notice because option default will flip in next major; http://goo.gl/bXjyyz

app.post('/webhook', function (req, res) {
    var reqBody;

    var cb = function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }

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
        if (error === "" || error === null) {
            subject += " ✔";
        } else if (stdout.match(/Other process is running. Aborting now/i) !== null) {
            subject += " †";
        } else {
            subject += " ✘";
        }


        // NB! No need to recreate the transporter object. You can use
        // the same transporter object for all e-mails
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.userName + " <" + config.user + ">", // sender address
            to: config.to, // list of receivers
            subject: subject, // Subject line
            text: '<b>stdout</b><br>' + stdout + "<br><b>stderr</b><br>" + stderr + "<br><span style='color:red'><b>error</b><br>" + error, // plaintext body 'Hello world ✔'
            html: '<pre><b>stdout</b><br>' + stdout + "<br><br><b>stderr</b><br>" + stderr + "<br><br><span style='color:red'><b>error</b><br></span>" + error + "<br><br><b>server log: req.body</b><br>" + reqBody + "</pre>",// html body
            attachments: [
                {
                    filename: "unit-tests-results.log",
                    path: "../../tests/unit-tests/unit-tests-results.log"
                },
                {
                    filename: "static-analyzer-results.log",
                    path: "../../tests/static-analyzer/static-analyzer-results.log"
                },
                {
                    filename: "end-to-end-results.log",
                    path: "../../tests/e2e/end-to-end-results.log"
                },
                {
                    filename: "pullingAndTesting.sh.log",
                    path: "pullingAndTesting.sh.log"
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
    };

    if (req.body.repository.url === config.repoUrl) {
        console.log('>>>>>req', req.body, '<<<<<<');
        reqBody = JSON.stringify(req.body);
        console.log('Now do a git pull for the current branch');
        child = exec("./pullingAndTesting.sh -t " + testConfig.port + " -a " + acceptanceConfig.port, cb);

        console.log(child);

    }
    res.send({});
});

app.all('*', function (req, res) {
    console.log('>>>>> 404 error\n', req, '\n 404 error <<<<<');
    res.send(404, {msg: 'Nothing here. This is the webhook for github'});
});

app.listen(config.port);

