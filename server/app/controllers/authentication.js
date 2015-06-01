/*jslint node: true */
(function () {
    "use strict";

    exports.sessionLogin = function (username, password, done) {
        if (username === "test" && password === "test") {
            return done(null, {id: 1});
        }
        return done(null, false);
    };

    exports.googleLogin = function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    };

    exports.twitterLogin = function (token, tokenSecret, profile, done) {
        return done(null, profile);
    };

    exports.facebookLogin = function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    };

    exports.loggedIn = function (req, res) {
        res.redirect('/');
    };

    exports.serializeUser = function (user, done) {
        done(null, user);
    };

    exports.deserializeUser = function (user, done) {
        done(null, user);
    };

    exports.isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.sendStatus(401);
    };

    exports.logout = function (req, res) {
        req.logout();
        res.redirect('/');
    };

    exports.example = function (req, res) {
        res.json(
            {
                message: 'welcome to our api!',
                user: req.user
            }
        );
    };
}());

