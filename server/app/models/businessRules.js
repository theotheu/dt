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
    //TODO: Validation
    schemaName.path('model').validate(function (val) {
        //TODO: Model needs to exist
        return true;
        //return (val !== undefined && val !== null && val.length >= 8);
    }, 'ValidateModel');

    schemaName.path('property').validate(function (val) {
        //TODO: Property must exist in model
        return true;
    }, 'ValidateProperty');

    //TODO: Merge these 2 validations
    /**
     * http://stackoverflow.com/questions/7369326/validating-multiple-mongoose-schema-properties
     *  if (v === this.password) {
        return false;
    } else {
        return true;
    }
     */

    schemaName.path('equation').validate(function (val) {
        //TODO: equation must be a valid defined equasion
        return true;
    }, 'ValidateEquation');

    modelName = "BusinessRule";
    mongoose.model(modelName, schemaName);

}());