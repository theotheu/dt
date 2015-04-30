/*jslint node:true */

(function () {
    "use strict";
    /**
     * Module dependencies.
     */
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        schemaName,
        modelName;

    schemaName = new Schema({
            deploymentId: {type: String, required: true, unique: true},
            webLog: {type: String},
            bashLog: {type: String},
            staticTestLog: {type: String},
            unitTestLog: {type: String},
            e2eTestLog: {type: String},
            modificationDate: {type: Date, "default": Date.now}
        },
        {collection: 'tests'});

    modelName = "Test";
    mongoose.model(modelName, schemaName);

}());