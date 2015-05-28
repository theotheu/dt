/*jslint node:true */


/** @module Routes for business rules */
/** @class */
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/businessRules.js');

/** CREATE route for businessrules */
router
    .post('/businessrules', controller.create);

// RETRIEVE
router
    .get('/businessrules', controller.list)
    .get('/businessrules/:_id', controller.detail);

// UPDATE
router
    .put('/businessrules/:_id', controller.updateOne);

// DELETE
router
    .delete('/businessrules/:_id', controller.deleteOne);


module.exports = router;