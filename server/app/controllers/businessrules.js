/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    BusinessRule = mongoose.model('BusinessRule');

/**
 * Controller to create a business rule.
 *
 * @param req http request
 * @param res http response
 * @module businessRules/create
 */

exports.create = function (req, res) {

    var doc = new BusinessRule(req.body);

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
 * Controller to list business rules.
 * @param req http request
 * @param res http response
 * @module BusinessRules/list
 */
exports.list = function (req, res) {
    var conditions, fields, sort;

    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    BusinessRule
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

/**
 * Controller to get a single business rule.
 * @param req http request
 * @param res http response
 * @module businessRules/detail
 */
exports.detail = function (req, res) {
    var conditions, fields;

    conditions = {_id: req.params._id};
    fields = {};

    BusinessRule
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
 * Controller to update _one_ business rule
 * @module businessRules/update
 * @param req http request
 * @param res http response
 */
exports.updateOne = function (req, res) {
//TODO: Fix this.
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

    BusinessRule
        .findOneAndUpdate(conditions, update, options, callback);
};

/**
 * Controller to delete a business rule.
 * @module businessRules/delete
 * @param req http request
 * @param res http response
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

    BusinessRule
        .remove(conditions, callback);
};
