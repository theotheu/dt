/*jslint node: true */
/*globals myApp */


/**
 * @param $scope
 * @param usersService
 * @constructor
 */
function UserListCtrl($scope, usersService) {
    "use strict";
    // GET all users
    $scope.users = usersService.users.get();
}

/**
 * @param $scope
 * @param $routeParams
 * @param $location
 * @param usersService
 * @constructor
 */
function UserDetailCtrl($scope, $routeParams, $location, usersService) {
    "use strict";
    // GET 1 user

    if ($routeParams._id !== 'new') {
        $scope.users = usersService.users.get({_id: $routeParams._id}, function () {
            console.log('$scope.requests ', $scope.requests);
        });
    }

    // DELETE user
    $scope.delete = function () {
        usersService.users.delete({_id: $routeParams._id});
        $location.path("/users");
    };

    // CREATE, UPDATE user
    $scope.save = function () {
        // $scope.checkPassword();

        if ($scope.users.doc && $scope.users.doc._id !== undefined) {
            console.log('Entering update');
            usersService.users.update({_id: $scope.users.doc._id}, $scope.users, function (res) {
                console.log(res);
            });
        } else {
            console.log('Entering save');
            usersService.users.save({}, $scope.users.doc, function (res) {
                console.log(res);
            });
        }
    };

}
