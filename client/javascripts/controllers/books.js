/*jslint node: true, nomen : true */
/*globals myApp */

/**
 * @param $scope
 * @param booksService
 * @constructor
 */
function BookListCtrl($scope, booksService) {
    "use strict";
    // GET all books
    $scope.books = booksService.books.get();
}

/**
 * @param $scope
 * @param $routeParams
 * @param $location
 * @param booksService
 * @constructor
 */
function BookDetailCtrl($scope, $routeParams, $location, booksService) {
    "use strict";
    // GET 1 book

    if ($routeParams._id !== 'new') {
        $scope.books = booksService.books.get({_id: $routeParams._id}, function () {
            console.log('$scope.requests ', $scope.requests);
        });
    }

    // DELETE book
    $scope.delete = function () {
        booksService.books.delete({_id: $routeParams._id});
        $location.path("/books");
    };

    // CREATE, UPDATE book
    $scope.save = function () {

        if ($scope.books.doc && $scope.books.doc._id !== undefined) {
            console.log('Entering update');
            booksService.books.update({_id: $scope.books.doc._id}, $scope.books, function (res) {
                console.log(res);
            });
        } else {
            console.log('Entering save');
            booksService.books.save({}, $scope.books.doc, function (res) {
                console.log(res);
            });
        }
    };
}