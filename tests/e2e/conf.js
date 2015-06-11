// conf.js
// @see https://github.com/angular/protractor/blob/master/referenceConf.js
//

var JSONReporter = require('jasmine-json-test-reporter');

exports.config = {
    // The address of a running selenium server. If specified, Protractor will
    // connect to an already running instance of selenium. This usually looks like
    // seleniumAddress: 'http://localhost:4444/wd/hub'
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // ----- What tests to run -----
    //
    // Spec patterns are relative to the location of this config.
    specs: ['specs.js'],

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        showColors: true, // Use colors in the command line report.
        showColors: true,
        isVerbose: true,
        includeStackTrace: true
    },
    framework: 'jasmine2',
    onPrepare: function () {
        jasmine.getEnv().addReporter(new JSONReporter({
            file: 'end-to-end-results.json',
            beautify: true,
            indentationLevel: 4 // used if beautify === true
        }));
    }
};