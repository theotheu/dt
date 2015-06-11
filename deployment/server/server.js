/*jslint node:true*/

(function () {
    "use strict";

    var express = require('express'),
        fs = require('fs'),
        bodyParser = require('body-parser'),
        mongoose,
        sys = require('sys'),
        exec = require('child_process').exec,
        app = express(),
        child,
        models_path,
        model_files,
        routes_path,
        route_files,
        testConfig = require('../../server/config/config.js')['test'],
        acceptanceConfig = require('../../server/config/config.js')['acceptance'],
        config = require('../../server/config/config.js')['deployment']
        ;

// Configure body-parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));     // Notice because option default will flip in next major; http://goo.gl/bXjyyz

    mongoose = require('mongoose');
    mongoose.connect(config.db);

    models_path = __dirname + '/app/models';
    model_files = fs.readdirSync(models_path);
    model_files.forEach(function (file) {
        require(models_path + '/' + file);
    });

    app.set('port', config.port);

    routes_path = __dirname + '/routes';
    route_files = fs.readdirSync(routes_path);
    route_files.forEach(function (file) {
        var route = require(routes_path + '/' + file);                  // Get the route
        app.use('/api', route);
    });

    app.use(express.static(__dirname + '/../client/'));

    app.post('/webhook', function (req, res) {
        var reqBody;

        var jsonFileExists = function(file){
            if (fs.existsSync(file)){
                return JSON.parse(fs.readFileSync(file).toString());
            } else {
                return JSON.parse('{"noFile": {"noFileText": "Sorry, no log file found..."}}');
            }
        };

        var textFileExists = function(file){
            if (fs.existsSync(file)){
                return fs.readFileSync(file).toString();
            } else {
                return "Sorry, no log file found...";
            }
        };

        var deploymentSucceeded = function(execError){
            return execError === "" || execError === null;
        };

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
            if (deploymentSucceeded(error)) {
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
                        path: "../../tests/unit-tests/unit-tests-results.json"
                    },
                    {
                        filename: "static-analyzer-error-results.log",
                        path: "../../tests/static-analyzer/static-analyzer-error-results.json"
                    },
                    {
                        filename: "end-to-end-results.log",
                        path: "../../tests/e2e/end-to-end-results.json"
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

            var Deployment = require('./app/models/deployments');

            var deployment = new Deployment({
                deploymentId: "Deployment " + Date.now(),
                deploymentResult: deploymentSucceeded(error) ? "Succeeded" : "Failed",
                bashLog: textFileExists("./pullingAndTesting.sh.log"),
                staticTestLog: jsonFileExists("../../tests/static-analyzer/static-analyzer-error-results.json"),
                unitTestLog: jsonFileExists("../../tests/unit-tests/unit-tests-results.json"),
                e2eTestLog: jsonFileExists("../../tests/e2e/end-to-end-results.json")
            });

            deployment.save(function (err) {
            });
        };

        if (req.body.repository.url === config.repoUrl && req.body.ref === config.repoRef) {
            console.log('>>>>>req', req.body, '<<<<<<');
            reqBody = JSON.stringify(req.body);
            console.log('Now do a git pull for the current branch');
            //child = exec("./pullingAndTesting.sh -t " + testConfig.port + " -a " + acceptanceConfig.port, cb);
            cb(null, null, null);
        }
        res.send({});
    })

    app.all('*', function (req, res) {
        res.sendStatus(404);
    });

    app.listen(config.port);

    module.exports = app;

}());