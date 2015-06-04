/*jslint node: true */
(function () {
    "use strict";

    var mongoose = require('mongoose'),
        User = mongoose.model('User');

    exports.sessionLogin = function (username, password, done) {
        var conditions, user;
        conditions = {email: username};
        User.findOne(conditions, function (err, doc) {
            if (err) {
                return done(err);
            }
            if (doc && doc.validPassword(password)) {
                user = {name: doc.email, provider: 'local'};
                console.log(user);
                return done(null, {id: 1});
            }
            else {
                return done(null, false);
            }
        });
    };

    exports.googleLogin = function (accessToken, refreshToken, profile, done) {
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

