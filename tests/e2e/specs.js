// Load configuration
var env = process.env.NODE_ENV || 'development';
var config = require('../../server/config/config.js')[env],
    localConfig = require('./../config-test.json');

console.log('>>>>>', env, '<<<<<');

describe('Book test homepage', function () {

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/login/');
        element(by.model('user.username')).sendKeys('test@test.nl');
        element(by.model('user.password')).sendKeys('test');
        element(by.id('loginBtn')).click();
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
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/login/');
        element(by.model('user.username')).sendKeys('test@test.nl');
        element(by.model('user.password')).sendKeys('test');
        element(by.id('loginBtn')).click();
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
        var beforeCounter;
        var list = element.all(by.repeater('user in users'));
        list.count().then(function(c) {
            beforeCounter = c;
        })
            .then(function() {
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

                expect(users.count()).toEqual(beforeCounter - 1);

                // ... Here I add an item
                var secondAmmount = element.all(by.repeater('list in listData.myLists')).count();

                expect(secondAmmount).toEqual(beforeCounter + 1);
            });


    });


});



describe('CRUD on businessRules', function () {

    var _id;

    beforeEach(function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/login/');
        element(by.model('user.username')).sendKeys('test@test.nl');
        element(by.model('user.password')).sendKeys('test');
        element(by.id('loginBtn')).click();
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessRules/new');
    });

    it('should get the titles', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessRules/new');

        expect(browser.getTitle()).toBe('Book demo');
        expect(element(by.tagName('h1')).getText()).toBe('Book demo');
        expect(element(by.tagName('h2')).getText()).toBe('Business Rule');
    });

    /**
     * @see https://docs.angularjs.org/api/ng/directive/form
     */
    it('should display an empty form', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessRules/new');

        expect(element(by.model('businessRule.doc._id')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.name')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.model')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.property')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.equation')).getText()).toBe('');
        expect(element(by.model('businessRule.doc.expectedValue')).getText()).toBe('');

    });

    it('should create a business rule', function () {
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessRules/new');

        element(by.model('businessRule.doc.name')).sendKeys('e2e_test_rule');
        element(by.model('businessRule.doc.model')).sendKeys('Book');
        element(by.model('businessRule.doc.property')).sendKeys('title');
        element(by.model('businessRule.doc.equation')).sendKeys('!=');
        element(by.model('businessRule.doc.expectedValue')).sendKeys('forbiddenValue');

        element(by.id('saveBtn')).click();

    });

    it('should query the new created business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        element(by.model('query')).sendKeys('e2e_test_rule');

        var businessRules = element.all(by.repeater('businessRule in businessRule'));

        expect(businessRules.count()).toBe(1);
        expect(businessRules.get(0).getText()).toEqual('e2e_test_rule, Book, title');

    });

    it('should update the new created rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        // Find the user
        element(by.model('query')).sendKeys('e2e_test_rule');

        expect(element.all(by.repeater('businessRule in businessRule'))
            .first().getText())
            .toBe('e2e_test_rule, Book, title');


        // Click on list item (note the nested selector)
        element.all(by.repeater('businessRule in businessRule')).first().$('a').click();

        //Change title
        element(by.model('businessRule.doc.name')).clear();
        element(by.model('businessRule.doc.name')).sendKeys('e2e_test_rule_edit');
        element(by.id('saveBtn')).click();
        // Verify new values
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');
        element(by.model('query')).sendKeys('e2e_test_rule');

        expect(element.all(by.repeater('businessRule in businessRule'))
            .first().getText())
            .toBe('e2e_test_rule_edit, Book, title');
    });

    it('should delete the new created business rule', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        // Find the rule
        element(by.model('query')).sendKeys("e2e_test_rule");

        var nrRulesBefore = element.all(by.repeater('businessRule in businessRule')).count();

        expect(element.all(by.repeater('businessRule in businessRule'))
            .first().getText())
            .toBe('e2e_test_rule_edit, Book, title');

        // Click on list item (note the nested selector)
        element.all(by.repeater('businessRule in businessRule')).first().$('a').click();

        // Delete rule
        element(by.id('deleteBtn')).click();

        // Verify that the number of users is 7
        browser.get('http://' + localConfig.host + ':' + config.port + '/#/businessrules');

        var nrRulesAfter = element.all(by.repeater('businessRule in businessRule'));

        expect(nrRulesAfter.count()).toBe((nrRulesBefore));

    });


});