(function () {
    "use strict";
    var exec = require('child_process').exec,
        config = require('./config.js'),
        command,
        child;

    command =
        'jmeter -n -t jmeter-test.jmx' +
            ' -Jurl=' + config.url +
            ' -Jport=' + config.port +
            ' -Jprotocol=' + config.protocol +
            ' -Jthreads=' + config.threads +
            ' -Jrampup=' + config.rampup +
            ' -Jloop=' + config.loop +
            ' -Juser=' + config.user +
            ' -Jpassword=' + config.password;

    child = exec(command,
        function (error, stdout, stderr) {
            console.log(stdout);
            if (stderr !== '') {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('error: ' + error);
            }
        });
}());