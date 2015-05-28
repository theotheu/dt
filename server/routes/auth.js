/*jslint node:true */

/** @module Routes for authentication */
/** @class */
var express = require('express');
var router = express.Router();
var controller = require('../app/controllers/auth.js');

module.exports = function (passport, isAuthenticated) {
    // RETRIEVE
    router
        .get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}))
        .get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/', failureRedirect: '/'}))
        .get('/logout', controller.logout)
        .get('/auth/example', isAuthenticated, controller.example); //Example route which need te be authenticated

    return router;
};