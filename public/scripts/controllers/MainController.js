'use strict';

var app = angular.module('ConfusedApp', []);
app.controller('MainController',function($scope, $log, $http, $document, MapService, VariableFactory){
	
	$scope.$watch(function() {
		return $scope.searchQuery;
	}, function(newValue) {
    	// check for specific value
    });

	$scope.mapSearch = () => {
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

			$scope.searchQuery = response.data.results[0].formatted_address;

		}, function errorCallback(response) {
			$log.error("ERROR:", response.data);
		});
	}


    // Initialize map when document has loaded
    $scope.initMap = () => {
    	MapService.initMap();
    };
    
});