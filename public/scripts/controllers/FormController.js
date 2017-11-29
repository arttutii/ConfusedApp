'use strict'

var app = angular.module('ConfusedApp');
app.controller('FormController',function($scope, $rootScope, $log, VariableFactory, $state){
	$scope.selectedSchool = VariableFactory.selectedSchool;

	$scope.currentYear = () => {
		$('#startYearInput').val(new Date().getFullYear());
		$log.info('qwe',new Date().getFullYear());
	}

});