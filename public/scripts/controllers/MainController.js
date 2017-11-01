'use strict';

var app = angular.module('ConfusedApp', []);
app.controller('MainController',function($scope, $rootScope, $log, $http, $document, MapService, VariableFactory){
	// Check all filters at start
	$scope.allchecked = true;

    // Listeners for function calls
    $scope.$on('showContent', (event, data) => {
    	MapService.showContent(data.e, data.text);
    })

    $scope.$on('getPlacePhoto', (event, data) => {
    	$scope.searchQuery = data;
    	$scope.mapSearch('placeId', (response) => {
    		//MapService.getPlacePhoto(response);
    	});
    })

    $scope.mapSearch = (check, callback) => {

    	let tempQuery = $scope.searchQuery.split('/');
    	$log.info(tempQuery);
    	let query;

    	// If query length has additional specifications, select only the string which has school name
    	let id = (tempQuery.length > 1) ? 1 : 0;
    	query = tempQuery[id].trim().replace(/\s/g, "+");
    	// split the query again, just in case there is a comma in the name
    	query = query.split(',');
    	query = query[0]

    	$log.info(query);
    	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
    	+ query + '&key=' + 'AIzaSyDMOfgmDAkbyNlYNzMt4GcmpsYqymC5ptQ';

    	$http({
    		method: 'GET',
    		url: url,
    		headers: {
    			'Accept': 'application/json'
    		}

    	}).then(function successCallback(response) {

    		let locData = response.data.results[0].geometry.location;
    		let newLocation = new google.maps.LatLng(locData.lat, locData.lng);

    		// Check for the first argument of the function call
    		switch(check){
    			// if Place ID is called, return it
    			case 'placeId':
    			callback(response.data.results[0].place_id);
    			break;
    			// If the search happens through the search input field and not by pins, center map on location
    			case 'searchInput':
    			VariableFactory.map.setCenter(newLocation);
    			VariableFactory.map.setZoom(15);
    			break;

    		}

    		$log.info(response.data);

    		if ($scope.searchMarker){
    			$scope.searchMarker.setMap(null);
    		}

    		$scope.searchMarker = new google.maps.Marker({
    			map: VariableFactory.map,
    			position: newLocation,
    			title: response.data.results[0].formatted_address
    		});

    		if (check == 'searchInput'){
    			$rootScope.$broadcast('showContent', {e: 'pic', text: ''});
    			let text = {
    				desc: 'Jos haluat nähdä koulun tiedot kartalla, paina koulun kohdalla olevaa sinistä merkkiä.',
    				name: 'Paina merkkiä kartalla'
    			}
    			$rootScope.$broadcast('showContent', {e: 'info', text: text});
    		} else {
    			// Set the actual location on the text input
    			$scope.searchQuery = response.data.results[0].formatted_address;
	    		// Get photo of the location and show it on side div
	    		MapService.getPlacePhoto(response.data.results[0].place_id);
	    	}

    	}, function errorCallback(response) {
    		$log.error("ERROR:", response.data);
    	});
    }

    $scope.clickCheckBox = (event) => {
    	let id = event.target.id;
    	switch(id){
    		case 'all':
    			$log.info('all')
    			
    			break;
    		case 'finnish':
    			$log.info('finnish')
    			
    			break;
    		case 'swedish':
    			$log.info('swedish')

    			break;    	
    		}
	};

    // Initialize map when document has loaded
    $scope.initialize = () => {
    	try {
    		MapService.initMap();
    	} catch (e) {
    		// if the device can not connect to the google maps services, show message on screen
    		$log.error(e);
    		$('#map').html(`<h3 style="text-align: center; background-color: #ffffff;">
    			Could not connect to Google Maps, please reload page.</h3>`);
    	}
    };
    
});