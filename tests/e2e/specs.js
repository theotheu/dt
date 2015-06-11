// Load configuration
var env = process.env.NODE_ENV || 'development';
var config = require('../../server/config/config.js')[env],
    localConfig = require('./../config-test.json');

console.log('>>>>>', env, '<<<<<');

describe('test oauth login at google, twitter and facebook', function () {
    beforeEach(function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/logout');
    });

    it('wrong username and password at google application must redirect to /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/google');

        //Login at google page
        browser.driver.findElement(by.id('Email')).sendKeys('testhamean@gmail.com');
        browser.driver.findElement(by.id('Passwd')).sendKeys('dCjWTd8W86aIOeVY0RT');
        browser.driver.findElement(by.id('signIn')).click().then(function() {
            browser.driver.get('http://' + localConfig.host + ':' + config.port);
            expect(browser.driver.getCurrentUrl()).toContain('/login');
        });
    }, 15000);

    it('wrong username and password at facebook application must redirect to /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/facebook');

        //Login at facebook
        browser.driver.findElement(by.id('email')).sendKeys('testhanean@gmail.com');
        browser.driver.findElement(by.id('pass')).sendKeys('A6f614b3a29beb9b7b0ffecbd6ae908Aw');
        browser.driver.findElement(by.id('loginbutton')).click().then(function() {
            browser.driver.get('http://' + localConfig.host + ':' + config.port);
            expect(browser.driver.getCurrentUrl()).toContain('/login');
        });
    }, 15000);

    it('wrong username and password at twitter application must redirect to /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/twitter');

        //Login at twitter
        browser.driver.findElement(by.id('username_or_email')).sendKeys('testhanmen');
        browser.driver.findElement(by.id('password')).sendKeys('N4weLbS4H2MezhIKU4a');
        browser.driver.findElement(by.id('allow')).click().then(function() {
            browser.driver.get('http://' + localConfig.host + ':' + config.port);
            expect(browser.driver.getCurrentUrl()).toContain('/login');
        });
    }, 15000);

    it('should login at google after that the url must not contain /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/google');

        //Login at google page
        browser.driver.findElement(by.id('Email')).sendKeys('testhanmean@gmail.com');
        browser.driver.findElement(by.id('Passwd')).sendKeys('dCjWfTd8W86aIOeVY0RT');
        browser.driver.findElement(by.id('signIn')).click().then(function() {
            var elementToFind = by.css('#submit_approve_access:not([disabled])'); //what element we are looking for
            browser.driver.wait(function() {
                return browser.driver.isElementPresent(elementToFind);
            }, 5000);
            browser.driver.findElement(elementToFind).click().then(function() {
                expect(browser.driver.getCurrentUrl()).not.toContain('/login');
            });
        });
    }, 15000);

    it('should login at facebook after that the url must not contain /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/facebook');

        //Login at facebook
        browser.driver.findElement(by.id('email')).sendKeys('testhanmean@gmail.com');
        browser.driver.findElement(by.id('pass')).sendKeys('A6f614b3a29beb9b7b0ffecbd6ae908Ad');
        browser.driver.findElement(by.id('loginbutton')).click().then(function() {
            expect(browser.driver.getCurrentUrl()).not.toContain('/login');
        });
    }, 15000);

    it('should login at twitter after that the url must not contain /login', function () {
        browser.driver.get('http://' + localConfig.host + ':' + config.port + '/auth/twitter');

        //Login at twitter
        browser.driver.findElement(by.id('username_or_email')).sendKeys('testhanmean');
        browser.driver.findElement(by.id('password')).sendKeys('N4weLbS4H2MezhIKU4ad');
        browser.driver.findElement(by.id('allow')).click().then(function() {
            expect(browser.driver.getCurrentUrl()).not.toContain('/login');
        });
    }, 15000);
});

describe('DT test login page', function () {

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port);
    });

    it('should get the titles', function () {

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('Login');

        // Get CSS value
        element(by.tagName('h1')).getCssValue('color')
            .then(function (v) {
                expect(v).toBe('rgba(0, 0, 0, 1)');
            });
    });

    /**
     * @see https://docs.angularjs.org/api/ng/directive/form
     */
    it('should display an empty login form', function () {
        expect(element(by.model('user.username')).getText()).toBe('');
        expect(element(by.model('user.password')).getText()).toBe('');
    });


    it('should login the user', function () {
        element(by.model('user.username')).sendKeys('emiel.roelofsen@gmail.com');
        element(by.model('user.password')).sendKeys('test1234');

        element(by.id('loginBtn')).click();

        // When succesfull login, the books page should be able to show.
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books');
        expect(element(by.tagName('h2')).getText()).toBe('Books');
    });

    it('should logout the user', function () {
        element(by.id('logoutLink')).click();

        // When successfull logout, the books page should not be able to show.
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books');
        expect(element(by.tagName('h2')).getText()).not.toBe('Books');
    });

    // Make sure to login the user again so the other tests can run as well.
    it('should login the user again', function () {
        element(by.model('user.username')).sendKeys('emiel.roelofsen@gmail.com');
        element(by.model('user.password')).sendKeys('test1234');

        element(by.id('loginBtn')).click();

        // When succesfull login, the books page should be able to show.
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books');
        expect(element(by.tagName('h2')).getText()).toBe('Books');
    });
});




describe('Book test homepage', function () {

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port);
    });

    it('should get the titles', function () {

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('Books');

        // Get CSS value
        element(by.tagName('h1')).getCssValue('color')
            .then(function (v) {
                expect(v).toBe('rgba(0, 0, 0, 1)');
            });

    });

    it('should count the number of books', function () {

        var books = element.all(by.repeater('book in books'));

        expect(books.count()).toBe(10);

    });

    it('should get the first book', function () {

        var books = element.all(by.repeater('book in books'));

        expect(books.get(0).getText()).toEqual('DOCTOR SLEEP, Stephen King');

    });

    it('should get the last book', function () {

        var books = element.all(by.repeater('book in books'));

        expect(books.last().getText()).toEqual('SYCAMORE ROW, John Grisham');

    });

    it('should filter the books and return 1 book', function () {

        element(by.model('query')).sendKeys('tar');

        var books = element.all(by.repeater('book in books'));

        expect(books.count()).toBe(1);
        expect(books.get(0).getText()).toEqual('THE GOLDFINCH, Donna Tartt');

    });
});

describe('CRUD on book', function () {

    var _id;

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books/new');
    });

    it('should get the titles', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books/new');

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('Book');

        // Get CSS value
        element(by.tagName('h1')).getCssValue('color')
            .then(function (v) {
                expect(v).toBe('rgba(0, 0, 0, 1)');
            });

    });

    /**
     * @see https://docs.angularjs.org/api/ng/directive/form
     */
    it('should display an empty form', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books/new');

        expect(element(by.model('books.doc._id')).getText()).toBe('');
        expect(element(by.model('books.doc.title')).getText()).toBe('');
        expect(element(by.model('books.doc.author')).getText()).toBe('');
        expect(element(by.model('books.doc.description')).getText()).toBe('');

    });

    it('should create a book', function () {

        /**
         * First we create the new book
         */
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books/new');

        element(by.model('books.doc.title')).sendKeys('ALL THE LIGHT WE CANNOT SEE');
        element(by.model('books.doc.author')).sendKeys('Anthony Doerr');
        element(by.model('books.doc.description')).sendKeys('The lives of a blind French girl and a gadget-obsessed German boy before and during World War II.');

        element(by.id('saveBtn')).click();

    });

    it('should query the new created book', function () {

        browser.get('http://' + localConfig.host + ':' + config.port);

        element(by.model('query')).sendKeys('Anthony Doerr');

        var books = element.all(by.repeater('book in books'));

        expect(books.count()).toBe(1);
        expect(books.get(0).getText()).toEqual('ALL THE LIGHT WE CANNOT SEE, Anthony Doerr');

    });

    it('should update the new created book', function () {

        browser.get('http://' + localConfig.host + ':' + config.port);

        // Find the book
        element(by.model('query')).sendKeys('Anthony Doerr');

        expect(element.all(by.repeater('book in books'))
            .first().getText())
            .toBe('ALL THE LIGHT WE CANNOT SEE, Anthony Doerr');


        // Click on list item (note the nested selector)
        element.all(by.repeater('book in books')).first().$('a').click();

        // Retrieve id for later retrieval
        // Issue with retrieving value from input field, @see https://github.com/angular/protractor/issues/140
        element(by.model('books.doc._id')).getAttribute('value')
            .then(function (v) {
                _id = v;

                // Set new values
                element(by.model('books.doc.title')).clear();
                element(by.model('books.doc.title')).sendKeys('The Dreamer of the Snake');

                element(by.model('books.doc.author')).clear();
                element(by.model('books.doc.author')).sendKeys('Ruan Mashander');

                element(by.model('books.doc.description')).clear();
                element(by.model('books.doc.description')).sendKeys('Falling asleep was easy. Staying asleep was easy. Waking up was harder.');

                // Save new values
                element(by.id('saveBtn')).click();

                // Verify new values
                browser.get('http://' + localConfig.host + ':' + config.port);

                // Find the book
                element(by.model('query')).sendKeys(_id);

                expect(element.all(by.repeater('book in books'))
                    .first().getText())
                    .toBe('The Dreamer of the Snake, Ruan Mashander');

                // browser.pause();

            });

    });

    it('should delete the new created book', function () {

        browser.get('http://' + localConfig.host + ':' + config.port);

        // Find the book
        element(by.model('query')).sendKeys(_id);

        expect(element.all(by.repeater('book in books'))
            .first().getText())
            .toBe('The Dreamer of the Snake, Ruan Mashander');

        // Click on list item (note the nested selector)
        element.all(by.repeater('book in books')).first().$('a').click();

        // Delete book
        element(by.id('deleteBtn')).click();

        // Verify that the number of books is 10
        browser.get('http://' + localConfig.host + ':' + config.port);

        var books = element.all(by.repeater('book in books'));

        expect(books.count()).toBe(10);

    });


});


describe('CRUD on user', function () {

    var _id;

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users/new');
    });

    it('should get the titles', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users/new');

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('User');

        // Get CSS value
        element(by.tagName('h1')).getCssValue('color')
            .then(function (v) {
                expect(v).toBe('rgba(0, 0, 0, 1)');
            });

    });

    /**
     * @see https://docs.angularjs.org/api/ng/directive/form
     */
    it('should display an empty user form', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users/new');

        expect(element(by.model('users.doc._id')).getText()).toBe('');
        expect(element(by.model('users.doc.email')).getText()).toBe('');
        expect(element(by.model('users.doc.password')).getText()).toBe('');

    });

    it('should create a user', function () {

        /**
         * First we create the new user
         */
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users/new');

        element(by.model('users.doc.email')).sendKeys('test1234@test.nl');
        element(by.model('users.doc.password')).sendKeys('test1234');

        element(by.id('saveBtn')).click();

    });

    it('should query the new created user', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users');

        element(by.model('query')).sendKeys('test1234@test.nl');

        var users = element.all(by.repeater('user in users'));

        expect(users.count()).toBe(1);
        expect(users.get(0).getText()).toEqual('test1234@test.nl');

    });

    it('should update the new created user', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users');

        // Find the user
        element(by.model('query')).sendKeys('test1234@test.nl');

        expect(element.all(by.repeater('user in users'))
            .first().getText())
            .toBe('test1234@test.nl');


        // Click on list item (note the nested selector)
        element.all(by.repeater('user in users')).first().$('a').click();

        // Retrieve id for later retrieval
        // Issue with retrieving value from input field, @see https://github.com/angular/protractor/issues/140
        element(by.model('users.doc._id')).getAttribute('value')
            .then(function (v) {
                _id = v;

                // Set new values
                element(by.model('users.doc.email')).clear();
                element(by.model('users.doc.email')).sendKeys('test5678@test.nl');

                element(by.model('users.doc.password')).clear();
                element(by.model('users.doc.password')).sendKeys('test5678');

                // Save new values
                element(by.id('saveBtn')).click();

                // Verify new values
                browser.get('http://' + localConfig.host + ':' + config.port + '/#/users');

                // Find the user
                element(by.model('query')).sendKeys(_id);

                expect(element.all(by.repeater('user in users'))
                    .first().getText())
                    .toBe('test5678@test.nl');

                // browser.pause();

            });

    });

    it('should delete the new created user', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users');

        // Find the user
        element(by.model('query')).sendKeys(_id);

        expect(element.all(by.repeater('user in users'))
            .first().getText())
            .toBe('test5678@test.nl');

        // Click on list item (note the nested selector)
        element.all(by.repeater('user in users')).first().$('a').click();

        // Delete user
        element(by.id('deleteBtn')).click();

        // Verify that the number of users is 7
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/users');

        var users = element.all(by.repeater('user in users'));

        expect(users.count()).toBe(7);

    });
});

describe('CRUD on businessRules', function () {

    var _id;

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules/new');
    });

    it('should get the titles', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules/new');

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('Business Rule');

        // Get CSS value
        element(by.tagName('h1')).getCssValue('color')
            .then(function (v) {
                expect(v).toBe('rgba(0, 0, 0, 1)');
            });

    });

    /**
     * @see https://docs.angularjs.org/api/ng/directive/form
     */
    it('should display an empty bueiness rules form', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules/new');

        expect(element(by.model('businessRule.doc._id')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.name')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.model')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.property')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.equation')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.expectedValue')).getText()).toBe('');

    });

    it('should create a business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules/new');

        element(by.model('businessRule.doc.name')).sendKeys('test rule axbycz');
        element(by.model('businessRule.doc.model')).sendKeys('users');
        element(by.model('businessRule.doc.property')).sendKeys('email');
        element(by.model('businessRule.doc.equation')).sendKeys('like gmail.com');
        element(by.model('businessRule.doc.expectedValue')).sendKeys('true');

        element(by.id('saveBtn')).click();

    });

    it('should query the new created business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        element(by.model('query')).sendKeys('test rule axbycz');

        var users = element.all(by.repeater('businessRule in businessRule'));

        expect(users.count()).toBe(1);
        expect(users.get(0).getText()).toEqual('test rule axbycz, users, email');

    });

    it('should update the new created business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        // Find the business rule
        element(by.model('query')).sendKeys('test rule axbycz');

        expect(element.all(by.repeater('businessRule in businessRule'))
            .first().getText())
            .toBe('test rule axbycz, users, email');


        // Click on list item (note the nested selector)
        element.all(by.repeater('businessRule in businessRule')).first().$('a').click();

        // Retrieve id for later retrieval
        // Issue with retrieving value from input field, @see https://github.com/angular/protractor/issues/140
        element(by.model('businessRule.doc._id')).getAttribute('value')
            .then(function (v) {
                _id = v;

                // Set new values
                element(by.model('businessRule.doc.model')).clear();
                element(by.model('businessRule.doc.model')).sendKeys('books');
                element(by.model('businessRule.doc.property')).clear();
                element(by.model('businessRule.doc.property')).sendKeys('testProp');

                // Save new values
                element(by.id('saveBtn')).click();

                // Verify new values
                browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

                // Find the user
                element(by.model('query')).sendKeys(_id);

                expect(element.all(by.repeater('businessRule in businessRule'))
                    .first().getText())
                    .toBe('test rule axbycz, books, testProp');

                // browser.pause();

            });

    });

    it('should delete the new created business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        // Find the user
        element(by.model('query')).sendKeys(_id);

        expect(element.all(by.repeater('businessRule in businessRule'))
            .first().getText())
            .toBe('test rule axbycz, books, testProp');

        // Click on list item (note the nested selector)
        element.all(by.repeater('businessRule in businessRule')).first().$('a').click();

        // Delete user
        element(by.id('deleteBtn')).click();

        // Verify that the number of users is 7
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        var users = element.all(by.repeater('businessRule in businessRule'));

        expect(users.count()).toBe(0);

    });
});
