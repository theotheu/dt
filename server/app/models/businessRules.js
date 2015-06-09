/*jslint node:true */

(function () {
    "use strict";
    /**
     * Module dependencies.
     */
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        schemaName,
        modelName,
        errMsg;


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
    /*schemaName.path('model').validate(function (val) {
        try {
            return (mongoose.model(val) !== null && mongoose.model(val) !== undefined);
        } catch (err) {
            console.log(err.message);
            return false;
        }
    }, 'Model does not exist!');

    schemaName.path('property').validation(function (val) {
        return true;
    }, 'Property does not exist!');*/

    schemaName.pre('validate', function(next) {
        try {
            if (mongoose.model(this.model) !== null && mongoose.model(this.model) !== undefined) {
                if (mongoose.model(this.model).schema.path(this.property) !== null && mongoose.model(this.model).schema.path(this.property) !== undefined) {
                    next();
                }
            }
            else {
                errMsg = new Error('Model and/or property are nonexistent!');
                next(errMsg);
            }
        } catch (err) {
            console.log(err.message);
            errMsg = new Error('Model and/or property are nonexistent!');
            next(errMsg);
        }
    });

    modelName = "BusinessRule";
    mongoose.model(modelName, schemaName);

}());