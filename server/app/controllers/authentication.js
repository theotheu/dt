/*jslint node: true */
(function () {
    "use strict";

    exports.sessionLogin = function (username, password, done) {
        if (username === "test" && password === "test") {
            var user = {name:username,provider:"local"};
            return done(null, user);
        }
        return done(null, false);
    };

    exports.googleLogin = function (accessToken, refreshToken, profile, done) {
        var user = {name:profile.displayName,provider:"google"};
        return done(null, user);
    };

    exports.twitterLogin = function (token, tokenSecret, profile, done) {
        var user = {name:profile.displayName,provider:"twitter"};
        return done(null, user);
    };

    exports.facebookLogin = function (accessToken, refreshToken, profile, done) {
        var user = {name:profile.displayName,provider:"facebook"};
        return done(null, user);
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

    exports.status = function (req, res) {
        res.json(
            {
                isAuthenticated: req.isAuthenticated(),
                name: req.user ? req.user.name : null,
                provider: req.user ? req.user.provider : null
            }
        );
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

