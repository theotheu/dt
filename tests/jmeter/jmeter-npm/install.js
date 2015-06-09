/*jslint node:true */

(function () {
    "use strict";
    var download = require('download'),
        packages = require('./package.json').packages;

    for (var i in packages) {
        if (packages.hasOwnProperty(i)) {
            if (!packages[i].url || !packages[i].dest) {
                console.log(i + ": url or dest missing");
            }
            else {
                console.log("Downloading: " + i +
                    " (" + packages[i].url + ") " +
                    "to " + packages[i].dest
                );
                new download({mode: '755', extract: true})
                    .get(packages[i].url, packages[i].dest)
                    .run(function (err, files) {
                        if (err) {
                            console.log(err);
                        }
                    });
            }
        }
    }
}());