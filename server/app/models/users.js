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
     * Creates a new mongoose schema.
     * @class Schema/User
     * @returns Schema object
     * @see http://www.json.org/
     * @see http://mongoosejs.com/docs/schematypes.html
     * @see http://mongoosejs.com/docs/guide.html#collection
     */
    schemaName = new Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        modificationDate: {type: Date, "default": Date.now}
    },
        {collection: 'users'});

    /**
     * @class Model/User
     * @see http://mongoosejs.com/docs/models.html
     */
    modelName = "User";
    mongoose.model(modelName, schemaName);

}());