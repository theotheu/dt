/*jslint node:true */

(function () {
    "use strict";
    /**
     * Module dependencies.
     */
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        deploymentSchema;


    deploymentSchema = new Schema({
            deploymentId: {type: String, required: true, unique: true},
            bashLog: {type: String},
            staticTestLog: {type: String},
            unitTestLog: {type: String},
            e2eTestLog: {type: String},
            modificationDate: {type: Date, "default": Date.now}
        },
        {collection: 'deployments'});

    var Deployment = mongoose.model('Deployment', deploymentSchema);

    module.exports = Deployment;

}());