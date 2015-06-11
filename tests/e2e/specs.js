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

    it('should display an empty form', function () {

        browser.get('http://' + localConfig.host + ':' + config.port + '/#/books/new');

        expect(element(by.model('books.doc._id')).getText()).toBe('');
        expect(element(by.model('books.doc.title')).getText()).toBe('');
        expect(element(by.model('books.doc.author')).getText()).toBe('');
        expect(element(by.model('books.doc.description')).getText()).toBe('');

    });

    it('should create a book', function () {
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