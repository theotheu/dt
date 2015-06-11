/*global angular, BookListCtrl, BookDetailCtrl, UserListCtrl, UserDetailCtrl, LoginCtrl, BusinessRuleListCtrl, BusinessRuleDetailCtrl, SettingsCtrl */

/**
 *
 * Writing AngularJS Documentation
 *
 * @see https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
 * @see http://docs.angularjs.org/guide/concepts
 */
var myApp = angular.module('myApp', ['myApp.books', 'myApp.users', 'ngRoute'])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        "use strict";

        // Interceptor checking for 401
        $httpProvider.interceptors.push('authenticationInterceptor');

        // Get all books
        $routeProvider.when('/books', {
            templateUrl: 'partials/book-list.html',
            controller: BookListCtrl
        });

        // Get 1 book
        $routeProvider.when('/books/:_id', {
            templateUrl: 'partials/book-detail.html',
            controller: BookDetailCtrl
        });

        /** Users **/
            // Get all users
        $routeProvider.when('/users', {
            templateUrl: 'partials/user-list.html',
            controller: UserListCtrl
        });

        // Get 1 book
        $routeProvider.when('/users/:_id', {
            templateUrl: 'partials/user-detail.html',
            controller: UserDetailCtrl
        });

        // Login Form
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: LoginCtrl
        });

        /** BUSINESS RULE PAGES**/
        // Get all business rules
        $routeProvider.when('/businessrules', {
            templateUrl: 'partials/businessRules-list.html',
            controller: BusinessRuleListCtrl
        });

        // Get 1 book
        $routeProvider.when('/businessrules/:_id', {
            templateUrl: 'partials/businessRules-detail.html',
            controller: BusinessRuleDetailCtrl
        });

        /** Otherwise **/
            // When no valid route is provided
        $routeProvider.otherwise({
            redirectTo: "/books"
        });
    }]);
