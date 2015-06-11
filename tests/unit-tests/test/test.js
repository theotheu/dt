// Load configuration

var env = process.env.NODE_ENV || 'development',
    config = require('../../../server/config/config.js')[env],
    localConfig = require('../../config-test.json')
    ;

var should = require('should'),
    supertest = require('supertest'),
    authentication = require('./authentication');

describe('API Routing for CRUD operations on books', function () {

    var request = supertest(localConfig.host + ":" + config.port);
    var agent;

    var tmpBookId = null;
    var tmpBookResponse;

    before(function (done) {
        authentication.login(request, function (loginAgent) {
            agent = loginAgent;
            done();
        });
    });

    describe('CREATE book', function () {
        it('Should POST /books', function (done) {
            var req = request.post('/api/books');
            agent.attachCookies(req);
            req.send({
                    "title": "Great book!" + Date.now(),
                    "author": "John Doe",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            )
                .expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('create');
                    JSON.parse(res.text)
                        .should.have.property('err').be.exactly(null);
                    res.statusCode.should.be.exactly(200);
                    res.type.should.be.exactly('application/json');
                    res.charset.should.be.exactly('utf-8');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('author')
                        .be.exactly('John Doe');

                    tmpBookId = JSON.parse(res.text).doc._id;

                    done();
                });
        });
    });

    describe('RETRIEVE all books', function () {

        it('Should GET /books', function (done) {
            var req = request.get('/api/books');
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('list');
                    res.statusCode.should.be.exactly(200);

                    tmpBookResponse = res.text;

                    done();
                });
        });
    });

    describe('RETRIEVE 1 book', function () {
        it('Should GET /books/{id}', function (done) {
            var req = request.get('/api/books/' + tmpBookId);
            agent.attachCookies(req);
            req.expect('Content-Type', /application.json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action')
                        .be.exactly('detail');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('author')
                        .be.exactly('John Doe');
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('UPDATE 1 book', function () {
        it('Should PUT /books/{id}', function (done) {
            var req = request.put('/api/books/' + tmpBookId);
            agent.attachCookies(req);
            req.send({
                "doc": {
                    "title": "Good book " + Date.now(),
                    "author": "Ghostwriter",
                    "description": "Book is updated."
                }
            })
                .expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action')
                        .be.exactly('update');
                    JSON.parse(res.text)
                        .should.have.property('err')
                        .be.exactly(null);
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('author')
                        .be.exactly('Ghostwriter');
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('DELETE 1 book', function () {
        it('Should DELETE /books/{id}', function (done) {
            var req = request.del('/api/books/' + tmpBookId);
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('delete');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('ok')
                        .be.exactly(1);
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('n')
                        .be.exactly(1);
                    JSON.parse(res.text).should.have.property('err').be.exactly(null);
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('RETRIEVE all books to verify that the original collection is restored.', function () {
        it('Should GET /books', function (done) {
            var req = request.get('/api/books');
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('list');
                    res.statusCode.should.be.exactly(200);

                    done();
                });
        });
    });

    after(function (done) {
        authentication.logout(request, function () {
            done();
        });
    });

});

describe('API Routing for CRUD operations on users', function () {

    var request = supertest(localConfig.host + ":" + config.port);
    var agent;

    var tmpUserId = null;
    var tmpUserResponse;

    before(function (done) {
        authentication.login(request, function (loginAgent) {
            agent = loginAgent;
            done();
        });
    });

    describe('CREATE user', function () {
        it('Should POST /users', function (done) {
            var req = request.post('/api/users');
            agent.attachCookies(req);
            req.send({
                "email": "john.doe@email.com",
                "password": "1234567890"
            })
                .expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('create');
                    JSON.parse(res.text)
                        .should.have.property('err').be.exactly(null);
                    res.statusCode.should.be.exactly(200);
                    res.type.should.be.exactly('application/json');
                    res.charset.should.be.exactly('utf-8');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('email')
                        .be.exactly('john.doe@email.com');

                    tmpUserId = JSON.parse(res.text).doc._id;

                    done();
                });
        });
    });

    describe('RETRIEVE all users', function () {

        it('Should GET /users', function (done) {
            var req = request.get('/api/users');
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('list');
                    res.statusCode.should.be.exactly(200);

                    tmpUserResponse = res.text;

                    done();
                });
        });
    });

    describe('RETRIEVE 1 user', function () {
        it('Should GET /users/{id}', function (done) {
            var req = request.get('/api/users/' + tmpUserId);
            agent.attachCookies(req);
            req.expect('Content-Type', /application.json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action')
                        .be.exactly('detail');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('email')
                        .be.exactly('john.doe@email.com');
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('UPDATE 1 user', function () {
        it('Should PUT /users/{id}', function (done) {
            var req = request.put('/api/users/' + tmpUserId);
            agent.attachCookies(req);
            req.send({
                "doc": {
                    "email": "doe.john@emails.com",
                    "password": "1234567890"
                }
            })
                .expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    console.log(res);
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action')
                        .be.exactly('update');
                    JSON.parse(res.text)
                        .should.have.property('err')
                        .be.exactly(null);
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('email')
                        .be.exactly('doe.john@emails.com');
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('DELETE 1 user', function () {
        it('Should DELETE /users/{id}', function (done) {
            var req = request.del('/api/users/' + tmpUserId);
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('delete');
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('ok')
                        .be.exactly(1);
                    JSON.parse(res.text)
                        .should.have.property('doc')
                        .and.have.property('n')
                        .be.exactly(1);
                    JSON.parse(res.text).should.have.property('err').be.exactly(null);
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('RETRIEVE all users to verify that the original collection is restored.', function () {
        it('Should GET /users', function (done) {
            var req = request.get('/api/users');
            agent.attachCookies(req);
            req.expect(200)                                                // supertest
                .expect('Content-Type', /application.json/)                 // supertest
                .expect('Content-Type', 'utf-8')                            // supertest
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    JSON.parse(res.text)
                        .should.have.property('meta')
                        .and.have.property('action').be.exactly('list');
                    res.statusCode.should.be.exactly(200);

                    done();
                });
        });
    });

    after(function (done) {
        authentication.logout(request, function () {
            done();
        });
    });

});