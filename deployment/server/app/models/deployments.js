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
            deploymentResult: {type: String},
            bashLog: {type: String},
            staticTestLog: {type: Object},
            unitTestLog: {type: Object},
            e2eTestLog: {type: Object},
            modificationDate: {type: Date, "default": Date.now}
        },
        {collection: 'deployments'});

    var Deployment = mongoose.model('Deployment', deploymentSchema);

    module.exports = Deployment;

}());