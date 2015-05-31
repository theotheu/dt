/*jslint node: true */
/*globals myApp */


function DeploymentListCtrl($scope, deploymentsService) {
    "use strict";
    // GET all deployments
    $scope.deployments = deploymentsService.deployments.get();
}

function DeploymentDetailCtrl($scope, $routeParams, $location, deploymentsService) {
    "use strict";
    // GET 1 deployment
    if ($routeParams._id !== 'new') {
        $scope.deployments = deploymentsService.deployments.get({_id: $routeParams._id}, function () {
            console.log('$scope.requests ', $scope.requests);
        });
    }
}