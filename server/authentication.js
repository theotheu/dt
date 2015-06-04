/*jslint node: true */
(function () {

    "use strict";

    var passport = require('passport'),
        session = require('express-session'),
        LocalStrategy = require('passport-local').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        TwitterStrategy = require('passport-twitter').Strategy,
        FacebookStrategy = require('passport-facebook').Strategy,
        controller = require('./app/controllers/authentication.js');

    module.exports = function (app, env) {
        app.use(session({secret: 'sessionsecret'}));
        app.use(passport.initialize());
        app.use(passport.session());

        var configAuth = require('./config/oauth.config')[env];

        passport.use(
            'google',
            new GoogleStrategy(
                {
                    clientID: configAuth.googleAuth ? configAuth.googleAuth.clientID : "-",
                    clientSecret: configAuth.googleAuth ? configAuth.googleAuth.clientSecret : "-",
                    callbackURL: configAuth.googleAuth ? configAuth.googleAuth.callbackURL : "-"
                },
                controller.googleLogin
            ));

        passport.use(
            'twitter',
            new TwitterStrategy(
                {
                    consumerKey: configAuth.twitterAuth ? configAuth.twitterAuth.clientID : "-",
                    consumerSecret: configAuth.twitterAuth ? configAuth.twitterAuth.clientSecret : "-",
                    callbackURL: configAuth.twitterAuth ? configAuth.twitterAuth.callbackURL : "-"
                },
                controller.twitterLogin
            ));

        passport.use(
            'facebook',
            new FacebookStrategy(
                {
                    clientID: configAuth.facebookAuth ? configAuth.facebookAuth.clientID : "-",
                    clientSecret: configAuth.facebookAuth ? configAuth.facebookAuth.clientSecret : "-",
                    callbackURL: configAuth.facebookAuth ? configAuth.facebookAuth.callbackURL : "-"
                },
                controller.facebookLogin
            ));

        passport.use(
            'login',
            new LocalStrategy(controller.sessionLogin)
        );

        passport.serializeUser(controller.serializeUser);

        passport.deserializeUser(controller.deserializeUser);

        app
            .post('/login', passport.authenticate('login',{failureRedirect: '/'}), controller.loggedIn)
            .get('/auth/twitter', passport.authenticate('twitter'))
            .get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/'}))
            .get('/auth/facebook', passport.authenticate('facebook'))
            .get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/'}))
            .get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}))
            .get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/'}))
            .get('/auth/example', controller.isAuthenticated, controller.example)
            .get('/auth/status', controller.status)
            .get('/logout', controller.logout)
            .all('/api/*', controller.isAuthenticated);
    };
}());