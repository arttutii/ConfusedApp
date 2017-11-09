'use strict';

/** TODO:
	** Search functionality
	Search input enter key on the right side as icon
	Remove Geolocation icon from the right side of search bar
	
	** Other pages
	Students information page content

	** Navbar
	Implement alert feature in the middle of the secondary navigation
	Tom's new mobile design and stuff
	Add language options in the middle of navbar

**/

var app = angular.module('ConfusedApp', ['ui.router']);
	// Router of the application view, directs the html views on the ui-view element
	app.config(function($urlRouterProvider, $stateProvider){
		$stateProvider

		.state('map', {
			url: '/',
			templateUrl: '../../views/mainpage.html'
		})

		.state('info', {
			url: '/tiedot',
			templateUrl: '../../views/info.html'
		}) 

		$urlRouterProvider.otherwise('/');

	});

	app.controller('MainController',function($scope, $rootScope, $log, $state, $http, $document, MapService, VariableFactory){
	// Check all filters at start
	$scope.allchecked = true;
	// Save the state of the current view in a variable 
	$scope.state = $state;

    // Listeners for function calls that $scope.$broadcast can activate from different controllers
    $scope.$on('showContent', (event, data) => {
    	MapService.showContent(data.e, data.text);
    })

    $scope.$on('getPlacePhoto', (event, data) => {
    	$scope.searchQuery = data;
    	$scope.mapSearch('placeId', (response) => {
    		// do nothing, mapsearch requires callback function
    	});
    })

    $scope.mapSearch = (check, callback) => {

    	// Names sometimes have too long descriptions, split the unnecessary information
    	let tempQuery = $scope.searchQuery.split('/');

    	// If query length has additional specifications, select only the string which has school name
    	let id = (tempQuery.length > 1) ? 1 : 0;
    	let query = tempQuery[id].trim().replace(/\s/g, "+");
    	// split the name again, just in case there is a comma with additional info
    	query = query.split(',');
    	query = query[0]

    	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
    	+ query + '&key=' + 'AIzaSyDMOfgmDAkbyNlYNzMt4GcmpsYqymC5ptQ';

    	$http({
    		method: 'GET',
    		url: url,
    		headers: {
    			'Accept': 'application/json'
    		}

    	}).then(function successCallback(response) {
    		let locData, newLocation;

    		// If the query does not find a location, show an alert window
    		try {
    			locData = response.data.results[0].geometry.location;
    			newLocation = new google.maps.LatLng(locData.lat, locData.lng);
    		} catch (e){
    			$('#inputAlert').show();
    			setTimeout(() => {
    				$('#inputAlert').fadeOut();
    			}, 3500)
    		}


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
    		// if the searchmarker of previous search is on map, remove it 
    		if ($scope.searchMarker){
    			$scope.searchMarker.setMap(null);
    		}
    		// add new marker of the current search
    		$scope.searchMarker = new google.maps.Marker({
    			map: VariableFactory.map,
    			position: newLocation,
    			title: response.data.results[0].formatted_address
    		});

    		// If the search was done via search input field, show different text on info area 
    		if (check == 'searchInput'){
    			// Do not show school apply button in the info area when no school info is present 
    			$scope.showApplyBtn = false;
    			$rootScope.$broadcast('showContent', {e: 'pic', text: ''});
    			let text = {
    				desc: 'Jos haluat nähdä koulun tiedot kartalla, paina koulun kohdalla olevaa sinistä merkkiä.',
    				name: 'Paina merkkiä kartalla'
    			}
    			$rootScope.$broadcast('showContent', {e: 'info', text: text});
    		} else {
    			// Show the apply button with the school information
    			$scope.showApplyBtn = true;
    			// Set the actual location on the text input
    			$scope.searchQuery = response.data.results[0].formatted_address;
	    		// Get photo of the location and show it on side div
	    		MapService.getPlacePhoto(response.data.results[0].place_id);
	    	}

	    }, function errorCallback(response) {
	    	$log.error("ERROR:", response.data);
	    });
    }

    // Function for handling filtering with the checkboxes
    // TODO, have to figure out how to get individual school's language
    $scope.clickCheckBox = (event) => {
    	let id = event.target.id;
    	switch(id){
    		case 'all':
    			//$log.info('all')
    			break;
    			case 'finnish':
    			//$log.info('finnish')   			
    			break;
    			case 'swedish':
    			//$log.info('swedish')
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