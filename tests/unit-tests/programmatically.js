/**
 * Created by theotheu on 15-04-15.
 */
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha({
    ui: "exports",
    reporter: "json"
});

var passed = [];
var failed = [];
// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
fs.readdirSync(__dirname + '/test/').filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';
}).forEach(function (file) {
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join(__dirname + '/test/', file)
    );
});



// Now, you can run the tests.
mocha.run(function (failures) {

    console.log(">>>>>", failures, "<<<<<");
    process.on('exit', function () {

        process.exit(failures);
    });
});
