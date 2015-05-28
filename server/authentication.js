/*jslint node: true */
(function () {

    "use strict";

    var passport = require('passport'),
        session = require('express-session'),
        LocalStrategy = require('passport-local').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        controller = require('./app/controllers/authentication.js');

    module.exports = function (app, env) {

        app.use(session({ secret: 'sessionsecret' }));
        app.use(passport.initialize());
        app.use(passport.session());

        var configAuth = require('./config/oauth.config')[env];

        passport.use('google',
            new GoogleStrategy({
                    clientID: configAuth.googleAuth.clientID,
                    clientSecret: configAuth.googleAuth.clientSecret,
                    callbackURL: configAuth.googleAuth.callbackURL
                },
                controller.googleLogin
            ));

        passport.use(
            'login',
            new LocalStrategy(controller.sessionLogin)
        );

        passport.serializeUser(controller.serializeUser);

        passport.deserializeUser(controller.deserializeUser);

        app.post(
                '/login',
                passport.authenticate('login'),
                controller.loggedIn
            )
            .get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}))
            .get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/'}))
            .get('/logout', controller.logout)
            .get('/auth/example', controller.isAuthenticated, controller.example)
            .all('/api/*', controller.isAuthenticated);
    };
}());