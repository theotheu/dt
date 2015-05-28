/*jslint node: true */
"use strict";

exports.authenticate = function (req, res) {
    console.log("login");
    return res.send({});
};

exports.googlecallback = function (req, res) {
    console.log("callback");
    return res.send({});
};

exports.logout = function (req, res) {
    console.log("logout");
    return res.send({});
};

function ensureAuthenticated(req, res, next) {
    /*
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
    */
}
