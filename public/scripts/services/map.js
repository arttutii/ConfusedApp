app.service('MapService', function($log, VariableFactory) {
	// This module returns functions to be used elsewhere

	return {

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
				showInContentWindow(text);
			});

			showInContentWindow = (text) => {
				var sidediv = document.getElementById('schoolInfo');
				sidediv.innerHTML = text.info;
			};

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

		}

	};

});