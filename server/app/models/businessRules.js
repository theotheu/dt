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

    /**
     * Business Rule schema
     *
     * @class Schema/BusinessRule
     * @returns Schema object
     */
    schemaName = new Schema(
        {
            name: {type: String, required: true, unique: true},
            model: {type: String, required: true},
            property: {type: String, required: true},
            equation: {type: String, required: true},
            expectedValue: {type: String, required: true},
            modificationDate: {type: Date, "default": Date.now}
        },
        {collection: 'businessRules'}
    );

    //TODO: Validation of model and property. Needs check on database to see if model and property exist.
    schemaName.path('model').validate(function (val) {
        try {
            return (mongoose.model(val) !== null && mongoose.model(val) !== undefined);
        } catch (err) {
            console.log(err.message);
            return false;
        }
    }, 'Model does not exist!');

    modelName = "BusinessRule";
    mongoose.model(modelName, schemaName);

}());