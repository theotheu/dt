/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    Book = mongoose.model('Book');

/**
 * CREATE a book
 * --------------------
 * Controller to create a book.
 *
 * Instructions, hints and questions
 * - Read about the 'save' method from Mongoose.
 * - Use the 'save' method from Mongoose.
 *   - Question: What are the differences between MongoDb and Mongoose?
 *   - Question: explain the concepts of 'schema type' and 'model'. How are they related?
 * - Return all fields.
 * - Use the model "Book".
 *
 * The return object has three properties:
 *
 * - meta: These are all optional and free to extend
 *   - method name: The name of the method
 *   - timestamp
 *   - filename: The name of the file. Use '__filename' for this.
 *   - duration: Duration of execution, time spend on server or other meaningful metric
 * - doc: The result object, in case of retrieving all objects, this is always an array. No documents is returned as an empty array.
 * - err: If no errors, it has the value 'null'
 *
 * Errors are not thrown in the node application but returned to the user.
 * - Question: What will happen if you throw an error on the server?
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.save/
 * @see http://mongoosejs.com/docs/api.html#model_Model-save
 * @module books/create
 */

exports.create = function (req, res) {

    var doc = new Book(req.body);

    doc.save(function (err) {

        var retObj = {
            meta: {
                "action": "create",
                'timestamp': new Date(),
                filename: __filename
            },
            doc: doc,
            err: err
        };

        return res.send(retObj);

    });

};

/**
 * RETRIEVE _all_ books
 * --------------------
 * Controller to retrieve _all_ books.
 *
 * Instructions, hints and questions
 * - Read about the 'find' method from Mongoose.
 * - Use the 'save' method from Mongoose.
 *   - Question: What are the differences between MongoDb and Mongoose?
 * - The 'query' parameter is an empty object.
 *   - Question: Why is it empty?
 * - Skip the options.
 *   - Question: Describe the options.
 * - Return all fields.
 * - Use the model "Book".
 *
 * The return object has three properties:
 *
 * - meta: These are all optional and free to extend
 *   - method name: The name of the method
 *   - timestamp
 *   - filename: The name of the file. Use '__filename' for this.
 *   - duration: Duration of execution, time spend on server or other meaningful metric
 * - doc: The result object, in case of retrieving all objects, this is always an array. No documents is returned as an empty array.
 * - err: If no errors, it has the value 'null'
 *
 * Errors are not thrown in the node application but returned to the user.
 * - Question: What will happen if you throw an error on the server?
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.find/
 * @see http://mongoosejs.com/docs/api.html#model_Model.find
 * @module books/list
 */
exports.list = function (req, res) {
    var conditions, fields, sort;

    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    Book
        .find(conditions, fields)
        .sort(sort)
        .exec(function (err, doc) {

            var retObj = {
                meta: {
                    "action": "list",
                    'timestamp': new Date(),
                    filename: __filename
                },
                doc: doc, // array
                err: err
            };

            return res.send(retObj);

        });
};

/**
 * RETRIEVE _one_ book
 * --------------------
 * Controller to retrieve _one_ books.
 *
 * Instructions, hints and questions
 * - Read about the 'findOne' method from Mongoose.
 * - Use the 'findOne' method from Mongoose.
 *   - Question: What is de result object from findOne?
 *   - Question: What are the differences between MongoDb and Mongoose?
 * - The 'query' parameter is an empty object.
 *   - Question: Why is it empty?
 * - Skip the options.
 * - Return all fields.
 * - Use the model "Book".
 * Question: Define route parameters and body parameter. What are the differences?
 *
 * The return object has three properties:
 *
 * - meta: These are all optional and free to extend
 *   - method name: The name of the method
 *   - timestamp
 *   - filename: The name of the file. Use '__filename' for this.
 *   - duration: Duration of execution, time spend on server or other meaningful metric
 * - doc: The result object is either an object or null.
 * - err: If no errors, it has the value 'null'
 *
 * @module books/detail
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.findOne/
 * @see http://mongoosejs.com/docs/api.html#model_Model.findOne
 */
exports.detail = function (req, res) {
    var conditions, fields;

    conditions = {_id: req.params._id};
    fields = {};

    Book
        .findOne(conditions, fields)
        .exec(function (err, doc) {
            var retObj = {
                meta: {"action": "detail", 'timestamp': new Date(), filename: __filename},
                doc: doc, // only the first document, not an array when using "findOne"
                err: err
            };
            return res.send(retObj);
        });
};

/**
 * UPDATE book
 * --------------------
 * Controller to update _one_ books.
 *
 * Instructions, hints and questions
 * - Read about the 'find' method from Mongoose.
 * - Use the 'findOneAndUpdate' method from Mongoose.
 *   - Question: What are the differences between MongoDb and Mongoose?
 *   - Question: What are the differences between MongoDb 'save' and MongoDb 'update'?
 *   - Question: What are the differences between MongoDb 'findAndModify' and Mongoose 'findOneAndUpdate'?
 * - Return all fields.
 * - Use the model "Book".
 * Question: What changes should be made to update more than one document?
 *
 * The return object has three properties:
 *
 * - meta: These are all optional and free to extend
 *   - method name: The name of the method
 *   - timestamp
 *   - filename: The name of the file. Use '__filename' for this.
 *   - duration: Duration of execution, time spend on server or other meaningful metric
 * - doc: The result object is either an object or null.
 * - err: If no errors, it has the value 'null'
 *
 * @module books/update
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.update/
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.save/
 * @see http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
 * @see http://docs.mongodb.org/manual/reference/command/findAndModify/
 */
exports.updateOne = function (req, res) {

    var conditions =
        {_id: req.params._id},
        update = {
            title: req.body.doc.title || '',
            author: req.body.doc.author || '',
            description: req.body.doc.description || ''
        },
        options = {multi: false},
        callback = function (err, doc) {
            var retObj = {
                meta: {
                    "action": "update",
                    'timestamp': new Date(),
                    filename: __filename,
                    'doc': doc,
                    'update': update
                },
                doc: update,
                err: err
            };

            return res.send(retObj);
        };

    Book
        .findOneAndUpdate(conditions, update, options, callback);
};

/**
 * DELETE
 * remove @ http://mongoosejs.com/docs/api.html#model_Model-remove
 * @param req
 * @param res
 */

/**
 * DELETE _one_ book
 * --------------------
 * Controller to delete _one_ books.
 *
 * Instructions, hints and questions
 * - Read about the 'findOne' method from Mongoose.
 * - Use the 'findOne' method from Mongoose.
 *   - Question: What is de result object from findOne?
 *   - Question: What are the differences between MongoDb and Mongoose?
 * - The 'query' parameter is an empty object.
 *   - Question: Why is it empty?
 * - Skip the options.
 * - Return all fields.
 * - Use the model "Book".
 * Question: Define route parameters and body parameter. What are the differences?
 *
 * The return object has three properties:
 *
 * - meta: These are all optional and free to extend
 *   - method name: The name of the method
 *   - timestamp
 *   - filename: The name of the file. Use '__filename' for this.
 *   - duration: Duration of execution, time spend on server or other meaningful metric
 * - doc: The result object is either an object or null.
 * - err: If no errors, it has the value 'null'
 *
 * @module books/detail
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.remove/
 * @see http://mongoosejs.com/docs/api.html#model_Model.remove
 */
exports.deleteOne = function (req, res) {
    var conditions, callback, retObj;

    conditions = {_id: req.params._id};
    callback = function (err, doc) {
        retObj = {
            meta: {
                "action": "delete",
                'timestamp': new Date(),
                filename: __filename
            },
            doc: doc,
            err: err
        };
        return res.send(retObj);
    };

    Book
        .remove(conditions, callback);
};
