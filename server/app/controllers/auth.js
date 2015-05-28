/*jslint node: true */
"use strict";

exports.example = function (req, res) {
    res.json({
            message: 'welcome to our api!',
            user: req.user
        }
    );
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};
