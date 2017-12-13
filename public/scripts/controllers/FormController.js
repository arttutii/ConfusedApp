'use strict'

var app = angular.module('ConfusedApp');
app.controller('FormController',function($scope, $rootScope, $log, VariableFactory, $state){
	$scope.selectedSchool = VariableFactory.selectedSchool;
	$scope.activeStep = 1;
	$scope.previousStep = 'step-1';

	$scope.initForm = () => {
		// set some default values on initialising the view
		$('#startYearInput').val(new Date().getFullYear());
		setTimeout(function(){
			$('#step-1').click();
		}, 50);
	}

	$scope.setActiveStep = (e) => {
		// set the clicked button as active and remove the class from previous button
		$scope.activeStep = e.target.textContent;
		$(`#${$scope.previousStep}`).removeClass('btn-default btn-primary');

		// Set the current as previous button and add the active class for it
		$scope.previousStep = e.target.id;
		$(`#${e.target.id}`).addClass('btn-primary');

		switch(e.target.textContent){
			case '1':
			$('#formInfo-1').show();
			$('#formInfo-2').hide();
			$('#formInfo-3').hide();
			$('#formInfo-4').hide();
			break;
			case '2':
			$('#formInfo-1').hide();
			$('#formInfo-2').show();
			$('#formInfo-3').hide();
			$('#formInfo-4').hide();
			break;
			case '3':
			$('#formInfo-1').hide();
			$('#formInfo-2').hide();
			$('#formInfo-3').show();
			$('#formInfo-4').hide();
			break;
			case '4':
			$('#formInfo-1').hide();
			$('#formInfo-2').hide();
			$('#formInfo-3').hide();
			$('#formInfo-4').show();
			break;
		}
	}

	$scope.nextStep = (e) => {
		if (e == 'prev'){
			$scope.setActiveStep({
				target: {
					id: ('step-' + (parseInt($scope.activeStep) - 1)).toString(),
					textContent: (parseInt($scope.activeStep) - 1).toString()
				}
			})
		} else {
			$scope.setActiveStep({
				target: {
					id: ('step-' + (parseInt($scope.activeStep) + 1)).toString(),
					textContent: (parseInt($scope.activeStep) + 1).toString()
				}
			})
		}
		
	}

});