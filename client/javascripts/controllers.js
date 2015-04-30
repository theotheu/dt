/*jslint node: true */
/*globals myApp */


/**
 * TODO: create controller for book list
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
 * TODO: create controller for retrieving 1 book, create and delete
 * @param $scope
 * @param $routeParams
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

myApp.controller('myCtrl', function ($scope) {
    "use strict";
    // TODO: bind settings with whoami
    $scope.whomai = "theotheu";
});

