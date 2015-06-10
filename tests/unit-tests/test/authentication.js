var superagent = require('superagent'),
    agent = superagent.agent(),
    localConfig = require('../../config-test.json');

exports.login = function (request, done) {
    request
        .post('/login')
        .type('form')
        .send({
            "username": localConfig.username,
            "password": localConfig.password
        })
        .expect(200)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            agent.saveCookies(res);
            done(agent);
        });
};

exports.logout = function (request, done) {
    request
        .get('/logout')
        .expect(200)                                                // supertest
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            agent.saveCookies(res);
            done();
        });
};
