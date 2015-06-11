/*global angular, DeploymentListCtrl, DeploymentDetailCtrl */

var myApp = angular.module('myApp', ['myApp.deployments', 'ngRoute'])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        "use strict";

        // Get all deployments
        $routeProvider.when('/deployments', {
            templateUrl: 'partials/deployment-list.html',
            controller: DeploymentListCtrl
        });

        // Get 1 deployment
        $routeProvider.when('/deployments/:_id', {
            templateUrl: 'partials/deployment-detail.html',
            controller: DeploymentDetailCtrl
        });

        /** Otherwise **/
            // When no valid route is provided
        $routeProvider.otherwise({
            redirectTo: "/deployments"
        });
    }]);
