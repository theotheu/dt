/*global angular */

(function () {
    "use strict";

    angular.module('myApp.books', ['ngResource']).factory('booksService', ['$resource', '$http',

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
        }])
        .factory('authenticationInterceptor', function ($q, $location) {
            return {
                responseError: function (response) {
                    if (response.status === 401) {
                        $location.url('/login');
                    }
                    return $q.reject(response);
                }
            };
        })
        .factory('loginService', ['$resource',

            function ($resource) {
                var actions = {
                        'login': {method: 'POST'}
                    };
                return $resource('/login', {}, actions);
            }])
        .factory('businessRulesService', ['$resource', '$http',

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
                db.businessRules = $resource('/api/businessRules/:_id', {}, actions);
                return db;
            }]);
}());