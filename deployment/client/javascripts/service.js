/*global angular */

(function () {
    "use strict";

    angular.module('myApp.deployments', ['ngResource']).factory('deploymentsService', ['$resource', '$http',

        function ($resource) {
            var actions = {
                    'get': {method: 'GET'},
                    'query': {method: 'GET', isArray: true}
                },
                db = {};
            // REST url to server
            db.deployments = $resource('/api/deployments/:_id', {}, actions);
            return db;
        }])
}());