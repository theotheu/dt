/**
 * Created by theotheu on 27-10-13.
 */

/**
 * Module dependencies.
 */
var fs = require('fs')
    , path = require('path')
    ;

// Load configuration
var env = process.env.NODE_ENV || 'development'
    , config = require('../server/config/config.js')[env];

// Bootstrap db connection
var mongoose = require('../server/node_modules/mongoose')
mongoose.connect(config.db);

// Debugging
mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});
mongoose.set('debug', config.debug);

// Bootstrap models
var models_path = __dirname + '/../server/app/models'
    , model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
    require(models_path + '/' + file);
})


var Book = mongoose.model('Book');


/**
 * Let's start with the tests
 */

describe('Book', function () {
    describe('CRUD operations with start up and tear down', function () {
        var doc = null;

        // Start up
        beforeEach(function (done) {
            doc = new Book({title: 'Nin-me-sara',
                author: 'Enheduanna',
                description: "First female writer"});
            doc.save(done);
        });

        // Tear down
        afterEach(function (done) {
            Book
                .remove({title: 'Nin-me-sara'}, done);
        });

        // Tests

        // GET all Books
        it("GET all Books", function (done) {
            Book
                .find({}, function (err, result) {
                    if (err || result.length === 0) {
                        throw err;
                    }
                    done();
                })
        });

        // GET all Books
        it("GET 1 Book", function (done) {
            Book
                .find({_id: doc._id}, function (err, result) {
                    if (err || result.length !== 1) {
                        throw err;
                    }
                    done();
                })
        });

        // Update Book
        it("UPDATE Book", function (done) {
            Book
                .update({_id: doc._id}, {description: 'Updated description'}, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    done();
                })
        });
    });


    describe('Simple CRUD operations', function () {
        var doc = null;

        // CREATE Book
        it("CREATE Book", function (done) {
            doc = new Book({title: 'Nin-me-sara',
                author: 'Enheduanna',
                description: "First female writer"});
            doc.save(done);
        });

        // GET all Books
        it("GET all Books", function (done) {
            Book
                .find({}, function (err, result) {
                    if (result.length === 0) {
                        throw err;
                    }
                    done();
                })
        });

        // GET all Books
        it("GET 1 Book", function (done) {
            Book
                .find({_id: doc._id}, function (err, result) {
                    if (result.length !== 1) {
                        throw err;
                    }
                    done();
                })
        });

        // Update Book
        it("UPDATE Book", function (done) {
            Book
                .update({_id: doc._id}, {description: 'Updated description'}, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    done();
                })
        });

        // DELETE Book
        it("DELETE Book", function (done) {
            Book
                .remove({_id: doc._id}, done);
        });

    });
});