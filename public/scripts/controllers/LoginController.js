'use strict';

var app = angular.module('ConfusedApp');
app.controller('LoginController',function($scope, $rootScope, $log, VariableFactory){
    $scope.loggedIn = false;

    $scope.login = () => {
        fetch('/login').then(res => {
            return res.json();
        }).then(res => {
            console.log(res);

            // after successful log in, change loggedIn variable state that some elements show/hide.
            // also toggle the popup to close it
            $scope.$apply($scope.loggedIn = true)
            $('#loginBtn').click();

        });
    }

});