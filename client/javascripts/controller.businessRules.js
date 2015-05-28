/*jslint node: true, nomen : true */
/*globals myApp */
/**
 *
 * @param $scope
 * @param businessRulesService
 * @constructor
 */
function BusinessRuleListCtrl($scope, businessRulesService) {
    "use strict";
    $scope.businessRule = businessRulesService.businessRules.get();
}
/**
 *
 * @param $scope
 * @param $routeParams
 * @param $location
 * @param businessRulesService
 * @constructor
 */
function BusinessRuleDetailCtrl($scope, $routeParams, $location, businessRulesService) {
    "use strict";
    // GET 1 rule

    if ($routeParams._id !== 'new') {
        $scope.businessRule = businessRulesService.businessRules.get({_id: $routeParams._id}, function () {
            console.log('$scope.requests ', $scope.requests);
        });
    }

    // DELETE rule
    $scope.delete = function () {
        businessRulesService.businessRules.delete({_id: $routeParams._id});
        $location.path("/businessRules");
    };

    // CREATE, UPDATE rule
    $scope.save = function () {
        if ($scope.businessRule.doc && $scope.businessRule.doc._id !== undefined) {
            console.log('Entering update');
            businessRulesService.businessRules.update({_id: $scope.businessRule.doc._id}, $scope.businessRule, function (res) {
                console.log(res);
            });
        } else {
            console.log('Entering save');
            businessRulesService.businessRules.save({}, $scope.businessRule.doc, function (res) {
                console.log(res);
            });
        }
    };
}
