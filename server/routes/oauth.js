/*jslint node:true */


/** @module Routes for oauth */
/** @class */
var express = require('express');
var router = express.Router();
var controller = require('../app/controllers/oauth.js');

// RETRIEVE
router
    .get('/oauth/authenticate', controller.authenticate)
    .get('/oauth/google/callback', controller.googlecallback)
    .get('/oauth/logout', controller.logout)

module.exports = router;