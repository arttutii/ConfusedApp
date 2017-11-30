'use strict'

var app = angular.module('ConfusedApp');
app.controller('FormController',function($scope, $rootScope, $log, VariableFactory, $state){
	$scope.selectedSchool = VariableFactory.selectedSchool;
	$scope.activeStep = 1;

	$scope.currentYear = () => {
		$('#startYearInput').val(new Date().getFullYear());
	}


	$scope.setActiveStep = (e) => {
		$log.info(e.target.textContent)
	}

});