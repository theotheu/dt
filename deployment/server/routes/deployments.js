/*jslint node:true */


/** @module Routes for deployments */
/** @class */
var express = require('express');
var router = express.Router();

// Deployment routes
var controller = require('../app/controllers/deployments.js');

// CREATE routes for deployments
router
    .post('/deployments', controller.create);


// RETRIEVE
router
    .get('/deployments', controller.list)
    .get('/deployments/:_id', controller.detail);


// DELETE
router
    .delete('/deployments/:_id', controller.deleteOne);


module.exports = router;