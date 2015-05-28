/*jslint node:true */


/** @module Routes for business rules */
/** @class */
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/businessRules.js');

/** CREATE route for businessRules */
router
    .post('/businessRules', controller.create);

// RETRIEVE
router
    .get('/businessRules', controller.list)
    .get('/businessRules/:_id', controller.detail);

// UPDATE
router
    .put('/businessRules/:_id', controller.updateOne);

// DELETE
router
    .delete('/businessRules/:_id', controller.deleteOne);


module.exports = router;