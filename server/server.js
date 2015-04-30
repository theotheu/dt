/*jslint node:true */

(function () {
    "use strict";

    /**
     * Module dependencies.
     * @type {exports}
     */
    var fs = require('fs'),                             // Used to read files from the filesystem (__dirname)
        express = require('express'),                   // Fast, unopinionated, minimalist web framework for Node.js
        bodyParser = require("body-parser"),            // This does not handle multipart bodies, due to their complex and typically large nature. For multipart bodies, you may be interested in the following modules:
        env,
        config,
        mongoose,
        models_path,
        model_files,
        app,
        routes_path,
        route_files;

    /**
     * Load configuration
     * @type {*|string}
     */
    env = process.env.NODE_ENV || 'development';
    config = require('./config/config.js')[env];

    /**
     * Bootstrap db connection
     * @type {exports}
     */
    mongoose = require('mongoose');
    mongoose.connect(config.db);

    /**
     * Debugging
     */
    console.log(config.debug);

    mongoose.connection.on('error', function (err) {
        console.error('MongoDB error: %s', err);
    });
    mongoose.set('debug', config.debug);                                // takes value from config.js

    /**
     * Bootstrap models
     * @type {string}
     */
    models_path = __dirname + '/app/models';
    model_files = fs.readdirSync(models_path);
    model_files.forEach(function (file) {
        require(models_path + '/' + file);
    });

    /**
     * Use express
     * @type {*}
     */
    app = express();
    /**
     * Express settings
     */
    app.set('port', process.env.PORT || config.port);                   // Set the port

    /**
     * Express middleware
     */
    app.use(bodyParser.json());                                         // Configure body-parser with JSON input
    app.use(bodyParser.urlencoded({extended: true}));                   // Notice because option default will flip in next major; http://goo.gl/bXjyyz

    /**
     * Middleware to enable logging
     */
    if (config.debug) {
        app.use(function (req, res, next) {
            console.log('%s %s %s', req.method, req.url, req.path);
            next();                                                    // Required to continue
        });
    }

    /**
     * Bootstrap routes
     * @type {string}
     */
    routes_path = __dirname + '/routes';
    route_files = fs.readdirSync(routes_path);
    route_files.forEach(function (file) {
        var route = require(routes_path + '/' + file);                  // Get the route
        app.use('/api', route);
    });

    /**
     * Middleware to serve static page
     */
    app.use(express.static(__dirname + '/../client/'));

    /**
     * Middleware to catch all unmatched routes
     */
    app.all('*', function (req, res) {
        res.sendStatus(404);
    });

    module.exports = app;

}());

