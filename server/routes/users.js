/*jslint node:true */


/** @module Routes for users */
/** @class */
var express = require('express');
var router = express.Router();

/**  user routes
 ---------------
 We create a variable "user" that holds the controller object.
 We map the URL to a method in the created variable "controller".
 In this example is a mapping for every CRUD action.
 */
var controller = require('../app/controllers/users.js');

/** CREATE route for users */
router
    .post('/users', controller.create);

// RETRIEVE
router
    .get('/users', controller.list)
    .get('/users/:_id', controller.detail);

// UPDATE
router
    .put('/users/:_id', controller.updateOne);

// DELETE
router
    .delete('/users/:_id', controller.deleteOne);


module.exports = router;