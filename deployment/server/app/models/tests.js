/*jslint node:true */

(function () {
    "use strict";
    /**
     * Module dependencies.
     */
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        schemaName,
        db;

    db = mongoose.connect('mongodb://server3.tezzt.nl/S513753-his');

    schemaName = new mongoose.Schema({
            deploymentId: {type: String, required: true, unique: true},
            webLog: {type: String},
            bashLog: {type: String},
            staticTestLog: {type: String},
            unitTestLog: {type: String},
            e2eTestLog: {type: String},
            modificationDate: {type: Date, "default": Date.now}
        },
        {collection: 'tests'});

    module.exports = db.model('Test', schemaName);

}());