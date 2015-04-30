/*global angular, BookListCtrl, BookDetailCtrl */


/**
 *
 * Writing AngularJS Documentation
 *
 * @see https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
 * @see http://docs.angularjs.org/guide/concepts
 */
var myApp = angular.module('myApp', ['myApp.services', 'ngRoute'])
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

        // When no valid route is provided
        $routeProvider.otherwise({
            redirectTo: "/books"
        });

    }]);
