app.service('MapService', function($log, $rootScope, VariableFactory) {
	// This module returns functions to be used elsewhere

	return {
		showContent: (e, text) => {
			switch(e){
				case 'info':
				console.log(text)
					$('#schoolTitle').text(text.name);
					$('#schoolDesc').html(text.desc);
					break;
				case 'pic':
					$('#schoolPic').attr('src',text);
					break;
			}
		},

		initMap: () => {
			VariableFactory.map = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: 'terrain'
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
				console.log(kmlEvent);
				// show the content on the side div
				$rootScope.$broadcast('showContent', {e: 'info', text: text});
				$rootScope.$broadcast('getPlacePhoto', text.name);

			});

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

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(pos) {
					var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
					myLocationMarker.setPosition(me);

					setTimeout(function(){
						map.setCenter(me);
						map.setZoom(12);
					}, 2000);
					
				}, function(error) {
					console.log(error);
				});
			} 

		},

		getPlacePhoto: (placeId) => {
			var request = {
				placeId: placeId
			};

			service = new google.maps.places.PlacesService(VariableFactory.map);
			service.getDetails(request, (place, status) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					let photos = place.photos;

					console.log(place);
					$rootScope.$broadcast('showContent', 
					{
						e: 'pic', 
						text: photos ? photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) : 'https://http.cat/404'
					});
				}
			});

		}

	};

});