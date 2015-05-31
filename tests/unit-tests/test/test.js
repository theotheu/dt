// Load configuration

var env = process.env.NODE_ENV || 'development',
    config = require('../../../server/config/config.js')[env],
    localConfig = require('../../config-test.json')
    ;

var should = require('should'),
    supertest = require('supertest');

describe('API Routing for CRUD operations on books', function () {

    var request = supertest(localConfig.host + ":" + config.port + "/" + localConfig.api_path);

    var tmpBookId = null;
    var tmpBookResponse;

    before(function (done) {
        done();
    });

    describe('CREATE book', function () {
        it('Should POST /books', function (done) {
            request
                .post('/books')
                .send({
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
            request
                .get('/books')
                .expect(200)                                                // supertest
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
            request
                .get('/books/' + tmpBookId)
                .expect('Content-Type', /application.json/)
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
            request
                .put('/books/' + tmpBookId)
                .send({
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
            request
                .del('/books/' + tmpBookId)
                .expect(200)                                                // supertest
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
            request
                .get('/books')
                .expect(200)                                                // supertest
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

});

describe('API Routing for CRUD operations on users', function () {

    var request = supertest(localConfig.host + ":" + config.port + "/" + localConfig.api_path);

    var tmpUserId = null;
    var tmpUserResponse;

    before(function (done) {
        done();
    });

    describe('CREATE user', function () {
        it('Should POST /users', function (done) {
            request
                .post('/users')
                .send({
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
            request
                .get('/users')
                .expect(200)                                                // supertest
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
            request
                .get('/users/' + tmpUserId)
                .expect('Content-Type', /application.json/)
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
            request
                .put('/users/' + tmpUserId)
                .send({
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
            request
                .del('/users/' + tmpUserId)
                .expect(200)                                                // supertest
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
            request
                .get('/users')
                .expect(200)                                                // supertest
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

});

describe('API Routing for CRUD operations on deployments', function () {

    var deploymentPort = require('../../../server/config/config.js')['deployment']
    var request = supertest(localConfig.host + ":" + deploymentPort + "/" + localConfig.api_path);

    var tmpDeploymentId = null;
    var tmpDeploymentResponse;

    before(function (done) {
        done();
    });

    describe('CREATE deployment', function () {
        it('Should POST /deployments', function (done) {
            request
                .post('/deployments')
                .send({
                    "deploymentId": "CRIA DT Deployment " + Date.now(),
                    "bashLog": "Testing bash log",
                    "staticTestLog": "Testing static test log",
                    "unitTestLog": "Testing unit test log",
                    "e2eTestLog": "Testing end 2 end test log"
                }
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
                        .and.have.property('bashLog')
                        .be.exactly('Testing bash log');

                    tmpDeploymentId = JSON.parse(res.text).doc._id;

                    done();
                });
        });
    });

    describe('RETRIEVE all deployments', function () {

        it('Should GET /deployments', function (done) {
            request
                .get('/deployments')
                .expect(200)                                                // supertest
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

                    tmpDeploymentResponse = res.text;

                    done();
                });
        });
    });

    describe('RETRIEVE 1 deployment', function () {
        it('Should GET /deployments/{id}', function (done) {
            request
                .get('/deployments/' + tmpBookId)
                .expect('Content-Type', /application.json/)
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
                        .and.have.property('bashLog')
                        .be.exactly('Testing bash log');
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });

    describe('DELETE 1 deployment', function () {
        it('Should DELETE /deployments/{id}', function (done) {
            request
                .del('/deployments/' + tmpBookId)
                .expect(200)                                                // supertest
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

    describe('RETRIEVE all deployments to verify that the original collection is restored.', function () {
        it('Should GET /deployments', function (done) {
            request
                .get('/deployments')
                .expect(200)                                                // supertest
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

});