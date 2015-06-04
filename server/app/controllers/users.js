/*jslint node: true */
"use strict";

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    bcrypt = require('bcryptjs');

/**
 * CREATE a user
 * --------------------
 * Controller to create a user
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.save/
 * @see http://mongoosejs.com/docs/api.html#model_Model-save
 * @module users/create
 */

exports.create = function (req, res) {

    var doc = new User(req.body), salt;

    /**
     * Create a synchronous bcrypt of the password.
     * @see https://github.com/ncb000gt/node.bcrypt.js/
     */
    salt = bcrypt.genSaltSync(10);
    doc.password = bcrypt.hashSync(doc.password, salt);

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
 * RETRIEVE _all_ users
 * --------------------
 * Controller to retrieve _all_ users.
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.find/
 * @see http://mongoosejs.com/docs/api.html#model_Model.find
 * @module users/list
 */
exports.list = function (req, res) {
    var conditions, fields, sort;

    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    User
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
 * RETRIEVE _one_ user
 * --------------------
 * Controller to retrieve _one_ users.
 * @module users/detail
 * @param req
 * @param res
 * @see http://docs.mongodb.org/manual/reference/method/db.collection.findOne/
 * @see http://mongoosejs.com/docs/api.html#model_Model.findOne
 */
exports.detail = function (req, res) {
    var conditions, fields;

    conditions = {_id: req.params._id};
    fields = {};

    User
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
 * UPDATE user
 * --------------------
 * Controller to update _one_ users.
 * @module users/update
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
            email: req.body.doc.email || '',
            password: req.body.doc.password || ''
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
        },
        salt;

    /**
     * Create a synchronous bcrypt of the password.
     * @see https://github.com/ncb000gt/node.bcrypt.js/
     */
    salt = bcrypt.genSaltSync(10);
    update.password = bcrypt.hashSync(update.password, salt);

    User
        .findOneAndUpdate(conditions, update, options, callback);
};


/**
 * DELETE _one_ user
 * --------------------
 * Controller to delete _one_ users.
 * @module users/detail
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

    User
        .remove(conditions, callback);
};
