/*global angular */

(function () {
    "use strict";

    angular.module('myApp.services', ['ngResource']).factory('booksService', ['$resource', '$http',

        function ($resource) {
            var actions = {
                    'get': {method: 'GET'},
                    'save': {method: 'POST'},
                    'query': {method: 'GET', isArray: true},
                    'update': {method: 'PUT'},
                    'delete': {method: 'DELETE'}
                },
                db = {};
            // REST url to server
            db.books = $resource('/api/books/:_id', {}, actions);
            return db;
        }]);
}());