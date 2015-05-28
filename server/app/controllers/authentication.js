/*jslint node: true */
(function () {
    "use strict";

    exports.login = function (username, password, done) {
        if (username === "test" && password === "test") {
            return done(null, {id: 1});
        }
        return done(null, false);
    };

    exports.serializeUser = function (user, done) {
        console.log(user);
        done(null, user.id);
    };

    exports.deserializeUser = function (id, done) {
        done(null, {id: 1});
    };

    exports.isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        res.sendStatus(401);
    };
}());

