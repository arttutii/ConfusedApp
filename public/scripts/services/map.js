app.service('MapService', function($log, $rootScope, VariableFactory) {
	// This module returns functions to be used elsewhere

	return {
		showContent: (e, text) => {
			switch(e){
				// handles the title and description text on the info area
				case 'info':
				//$log.info(text)
				$('#schoolTitle').text(text.name);
				$('#schoolDesc').html(text.desc);
				break;
				// add the path of picture for schools
				case 'pic':
				$('#schoolPic').attr('src',text);
				break;

			}
		},

		getCurrentLocation: () => {
			let map = VariableFactory.map;

			let myLocationMarker = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				title: 'Olet täällä.'
			});


			myLocationMarker.addListener('click', () => {
				if (myLocationMarker.getAnimation() !== null) {
					myLocationMarker.setAnimation(null);
				} else {
					myLocationMarker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(() => {
						myLocationMarker.setAnimation(null);
					}, 2200);
				}
			});

			// Save the marker in the variablefactory for use in MainController
			VariableFactory.myLocationMarker = myLocationMarker;

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(pos) {
					let me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
					myLocationMarker.setPosition(me);

					map.setCenter(me);
					map.setZoom(12);
					
				}, function(error) {
					console.log(error);
				});
				
			} else {
				// Browser does not support Geolocation
				// -- maybe show error somewhere on UI
				$log.info('browser doesnt support geolocation')
			}
		},

		initMap: () => {
			VariableFactory.map = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: 'terrain',
				fullscreenControl: false,
				mapTypeControl: false,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				streetViewControlOptions: {
					position: google.maps.ControlPosition.BOTTOM_LEFT
				},

			});
			let map = VariableFactory.map;

			/*let schoolAreas = new google.maps.KmlLayer({
				url: 'http://users.metropolia.fi/~arttutii/Confused/Oppilaaksiotto_alueet_2015_16.kml',
				suppressInfoWindows: true,
				map: map
			});

			schoolAreas.addListener('click', function(kmlEvent) {
				let text = {
					info: kmlEvent.featureData.description
				}
				console.log(kmlEvent);
				showInContentWindow(text);
			});*/

			// Get the school data from KML file and add them on the map
			let schoolPins = new google.maps.KmlLayer({
				url: 'http://users.metropolia.fi/~arttutii/Confused/palvelukartta.kml',
				suppressInfoWindows: true,
				map: map
			});

			schoolPins.addListener('click', function(kmlEvent) {
				let text = {
					desc: kmlEvent.featureData.description,
					name: kmlEvent.featureData.name,
					info: kmlEvent.featureData.infoWindowHtml
				}
				//console.log(kmlEvent);
				// show the content on the info area
				$rootScope.$broadcast('showContent', {e: 'info', text: text});
				$rootScope.$broadcast('getPlacePhoto', text.name);

				// Set map center and zoom in on the school pin
				map.setCenter(kmlEvent.latLng);
				map.setZoom(12);

		    	// scroll site to bottom if on mobile device
		    	const mq = window.matchMedia("(max-width: 767px)");
		    	if(mq.matches) {
		    		$("html, body").animate({ scrollTop: $(document).height() }, 500);
		    	}

		    });

			// if the searchmarker of previous search is on map, remove it 
			if (VariableFactory.myLocationMarker){
				VariableFactory.myLocationMarker.setMap(null);
			}
			// locate the user and pinpoint them on the map
			let myLocationMarker = VariableFactory.myLocationMarker;
			myLocationMarker = new google.maps.Marker({
				map: VariableFactory.map,
				animation: google.maps.Animation.DROP,
				title: 'Olet täällä.'
			});

			myLocationMarker.addListener('click', () => {
				if (myLocationMarker.getAnimation() !== null) {
					myLocationMarker.setAnimation(null);
				} else {
					myLocationMarker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(() => {
						myLocationMarker.setAnimation(null);
					}, 2200);
				}
			});

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(pos) {
					let me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
					myLocationMarker.setPosition(me);

					setTimeout(function(){
						map.setCenter(me);
						map.setZoom(12);
					}, 2000);
					
				}, function(error) {
					console.log(error);
					// At the end when KML layers have been loaded, set center of the map
					// This is in case user has not allowed geolocation
					// Coordinates hardcoded to Helsinki area
					setTimeout(function(){
						map.setCenter(new google.maps.LatLng(60.16985569999999,24.9383791));
						map.setZoom(8);
					}, 2000);
				});
				
			} 
		},

		getPlacePhoto: (placeId) => {
			// argument should contain the Google API's place ID for the location
			let request = {
				placeId: placeId
			};

			service = new google.maps.places.PlacesService(VariableFactory.map);
			service.getDetails(request, (place, status) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					let photos = place.photos;
					//console.log(place);

					// if there are photos for the location, add them to the info area
					$rootScope.$broadcast('showContent', 
					{
						e: 'pic', 
						text: photos ? photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) : '../../assets/images/place_404.jpg'
					});
				}
			});

		}

	};

});