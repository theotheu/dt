/*global angular, BookListCtrl, BookDetailCtrl, UserListCtrl, UserDetailCtrl */


/**
 *
 * Writing AngularJS Documentation
 *
 * @see https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
 * @see http://docs.angularjs.org/guide/concepts
 */
var myApp = angular.module('myApp', ['myApp.books', 'myApp.users', 'ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        "use strict";

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

        // When no valid route is provided
        $routeProvider.otherwise({
            redirectTo: "/books"
        });

    }]);
