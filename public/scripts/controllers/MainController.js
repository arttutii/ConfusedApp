'use strict';

var app = angular.module('ConfusedApp', []);
app.controller('MainController',function($scope, $rootScope, $log, $http, $document, MapService, VariableFactory){

	$scope.$watch(function() {
		return $scope.searchQuery;
	}, function(newValue) {
    	// check for specific value
    });

    // Listeners for function calls
    $scope.$on('showContent', (event, data) => {
    	MapService.showContent(data.e, data.text);
    })

    $scope.$on('getPlacePhoto', (event, data) => {
    	$scope.searchQuery = data;
    	$scope.mapSearch(data, (response) => {
    		MapService.getPlacePhoto(response);
    	});
    })

    $scope.mapSearch = (check, callback) => {
    	let query = $scope.searchQuery.trim().replace(/\s/g, "+");
    	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
    	+ query + '&key=' + 'AIzaSyDMOfgmDAkbyNlYNzMt4GcmpsYqymC5ptQ';

    	$http({
    		method: 'GET',
    		url: url,
    		headers: {
    			'Accept': 'application/json'
    		}

    	}).then(function successCallback(response) {
    		// If function is called expecting to return the place id of address, return it
    		if (check){
    			callback(response.data.results[0].place_id);
    		}

    		console.log(response.data);
    		let locData = response.data.results[0].geometry.location;
    		let newLocation = new google.maps.LatLng(locData.lat, locData.lng);

    		VariableFactory.map.setCenter(newLocation);
    		VariableFactory.map.setZoom(15);

    		if ($scope.searchMarker){
    			$scope.searchMarker.setMap(null);
    		}

    		$scope.searchMarker = new google.maps.Marker({
    			map: VariableFactory.map,
    			position: newLocation,
    			title: response.data.results[0].formatted_address
    		});
    		// Set the actual location on the text input
    		$scope.searchQuery = response.data.results[0].formatted_address;
    		// Get photo of the location and show it on side div
    		MapService.getPlacePhoto(response.data.results[0].place_id);

    	}, function errorCallback(response) {
    		$log.error("ERROR:", response.data);
    	});
    }


    // Initialize map when document has loaded
    $scope.initMap = () => {
    	MapService.initMap();
    };
    
});