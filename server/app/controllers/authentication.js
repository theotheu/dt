/*jslint node: true */
(function () {
    "use strict";

    exports.login = function (username, password, done) {
        if (username === "test" && password === "test") {
            return done(null, {id: 1});
        }
        return done(null, false);
    };

    exports.loggedIn = function(req, res    ) {
        res.redirect('/');
    }

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
}());

