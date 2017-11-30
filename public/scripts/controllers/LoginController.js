'use strict';

var app = angular.module('ConfusedApp');
app.controller('LoginController',function($scope, $rootScope, $log, VariableFactory, $state){
    $scope.loggedIn = false;
    $scope.parent = {};

    // Check if the user object is already in the session storage
    if(sessionStorage.getItem('user')){
        // If true, set variables depending on the value
        $scope.loggedIn = true;
        $scope.parent = VariableFactory.user = JSON.parse(sessionStorage.getItem('user'));
        $scope.selectedChild = $scope.parent.children[0];
    }

    $scope.login = () => {
    // HTTPS API calls won't work on Jelastic at the moment
        fetch('/login').then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            // save user object in the factory and in the scope
            $scope.parent = VariableFactory.user = res;
            // set the child select default value as the first child of the user
            $scope.selectedChild = $scope.parent.children[0];

            // after successful log in, change loggedIn variable state that some elements show/hide.
            // also toggle the popup to close it
            $scope.$apply($scope.loggedIn = true)
            $('#loginBtn').click();

            // save the user in the session storage
            sessionStorage.setItem('user', JSON.stringify(res));

            // Direct the user if they are on any other view than map
            if(!$state.is('map')) {
                $state.go('map');
            }

        });

    }

    $scope.logout = () => {
        $scope.loggedIn = false;
        // if the user is at the Personal information page, redirect them to map page
        if ($state.is('info')) {$state.go('map')};

        // Trigger the closing of the user menu
        $('#userBtn').click();
        
        // Clear the user object from the session storage
        sessionStorage.clear();
    }


});