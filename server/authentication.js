/*jslint node: true */
(function () {

    "use strict";

    var passport = require('passport'),
        session = require('express-session'),
        LocalStrategy = require('passport-local').Strategy,
        controller = require('./app/controllers/authentication.js');

    module.exports = function (app) {

        app.use(session({ secret: 'sessionsecret' }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(
            'login',
            new LocalStrategy(controller.login)
        );

        passport.serializeUser(controller.serializeUser);

        passport.deserializeUser(controller.deserializeUser);

        app.post(
            '/login',
            passport.authenticate('login'),
            controller.loggedIn
        );

        app.all('/api/*', controller.isAuthenticated);
    };
}());