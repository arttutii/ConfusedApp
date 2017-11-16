'use strict';

var app = angular.module('ConfusedApp');
app.controller('LoginController',function($scope, $rootScope, $log, VariableFactory, $state){
    $scope.loggedIn = false;
    $scope.parent = {};

    $scope.login = () => {
        fetch('/login').then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            // save user object in the factory and in the scope
            VariableFactory.user = res;
            $scope.parent = res;
            // set the child select default value as the first child of the user
            $scope.selectedChild = $scope.parent.children[0];

            // after successful log in, change loggedIn variable state that some elements show/hide.
            // also toggle the popup to close it
            $scope.$apply($scope.loggedIn = true)
            $('#loginBtn').click();

        });
    }

    $scope.logout = () => {
        $scope.loggedIn = false;
        // if the user is at the Personal information page, redirect them to map page
        if ($state.is('info')) {$state.go('map')};
    }

});