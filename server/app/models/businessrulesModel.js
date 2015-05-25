/*jslint node:true */

(function () {
    "use strict";
    /**
     * Module dependencies.
     */
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        businessRuleSchema,
        modelName;

    /**
     * Mongoose schema.
     *
     * @class Schema/BusinessRule
     * @returns Schema object
     * @see http://www.json.org/
     * @see http://mongoosejs.com/docs/schematypes.html
     * @see http://mongoosejs.com/docs/guide.html#collection
     */

    /**
     *model
     *property (field)
     *equation
     *expected value
     */

    businessRuleSchema = new Schema({
        description: {type: String, required: true},
        name: {type: String, required: true},
        model: {type: String, required: true},
        property: {type: String, required: true},
        equation: {type: Number, required: true},
        expectedValue: {type: String, required: true},
        modifiedDate: {type: String, default: Date.now()}
    },
        {collection: 'businessrules'});

    /**
     * Custom validators
     *
     * @class Validator/BusinessRule/description
     * @returns true or false. In case of ```false```, a message is returned as well.
     * @see http://mongoosejs.com/docs/validation.html
     */
    businessRuleSchema.path('description').validate(function (val) {
        return (val !== undefined && val !== null && val.length >= 8);
    }, 'Invalid description');

    businessRuleSchema.path('equation').validate(function (val) {
        return (val !== undefined && val !== null && val >- 5);
    }, 'Invalid equation');

    /**
     * Instructions, hints and questions.
     * - Instruction: Create a model for the defined schema.
     * - Question: What are the differences between a 'Model' and a 'Schema Type'? Use the references to motivate your answer.
     * @class Model/BusinessRule
     * @see http://mongoosejs.com/docs/models.html
     */
    modelName = "BusinessRule";
    mongoose.model(modelName, businessRuleSchema);

}());
