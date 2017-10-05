'use strict';

/*
require(["esri/map", "dojo/domReady!"], function(Map) {
	let map = new Map("map", {
		center: [-118, 34.5],
		zoom: 8,
		basemap: "topo"
	});
});
*/

// esrimap version #1, geographical location center 

let map;
let graphic;
let currLocation;
let watchId;
require([
	"esri/map", "esri/geometry/Point", 
	"esri/symbols/SimpleMarkerSymbol", 
	"esri/symbols/SimpleLineSymbol",
	"esri/graphic", 
	"esri/layers/KMLLayer",
	"esri/Color", 
    "dojo/parser", 
    "dojo/dom-style",
	"dojo/domReady!",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	], function(
		Map, KMLLayer,
		Point,
		SimpleMarkerSymbol, SimpleLineSymbol,
		Graphic, Color,
		parser, domStyle
		) {
		map = new Map("map", {
			basemap: "topo",
			center: [-85.957, 17.140],
			zoom: 2
		});
		map.on("load", initFunc);

		parser.parse();

		var kmlUrl = "http://users.metropolia.fi/~arttutii/Confused/Oppilaaksiotto_alueet_2015_16.kml";
		var kml = new KMLLayer(kmlUrl);
		map.addLayer(kml);
		kml.on("load", function() {
			domStyle.set("loading", "display", "none");
		});

		function orientationChanged() {
			if(map){
				map.reposition();
				map.resize();
			}
		}

		function initFunc(map) {
			if( navigator.geolocation ) {  
				navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
				watchId = navigator.geolocation.watchPosition(showLocation, locationError);
			} else {
				alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
			}
		}

		function locationError(error) {
          //error occurred so stop watchPosition
          if( navigator.geolocation ) {
          	navigator.geolocation.clearWatch(watchId);
          }
          switch (error.code) {
          	case error.PERMISSION_DENIED:
          	alert("Location not provided");
          	break;

          	case error.POSITION_UNAVAILABLE:
          	alert("Current location not available");
          	break;

          	case error.TIMEOUT:
          	alert("Timeout");
          	break;

          	default:
          	alert("unknown error");
          	break;
          }
      }

      function zoomToLocation(location) {
      	var pt = new Point(location.coords.longitude, location.coords.latitude);
      	addGraphic(pt);
      	map.centerAndZoom(pt, 12);
      }

      function showLocation(location) {
          //zoom to the users location and add a graphic
          var pt = new Point(location.coords.longitude, location.coords.latitude);
          if ( !graphic ) {
          	addGraphic(pt);
          } else { // move the graphic if it already exists
          	graphic.setGeometry(pt);
          }
          map.centerAt(pt);
      }

      function addGraphic(pt){
      	var symbol = new SimpleMarkerSymbol(
      		SimpleMarkerSymbol.STYLE_CIRCLE, 
      		12, 
      		new SimpleLineSymbol(
      			SimpleLineSymbol.STYLE_SOLID,
      			new Color([210, 105, 30, 0.5]), 
      			8
      			), 
      		new Color([210, 105, 30, 0.9])
      		);
      	graphic = new Graphic(pt, symbol);
      	map.graphics.add(graphic);
      }
  });
  

// Google map implementation with KML

/*function initMap() {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(60.56537850464181, 24.697265625),
		zoom: 8,
		mapTypeId: 'terrain'
	});

	var kmlLayer = new google.maps.KmlLayer({
		url: 'http://users.metropolia.fi/~arttutii/Confused/Oppilaaksiotto_alueet_2015_16.kml',
		suppressInfoWindows: true,
		map: map
	});

	kmlLayer.addListener('click', function(kmlEvent) {
		var text = kmlEvent.featureData.description;
		showInContentWindow(text);
	});

	function showInContentWindow(text) {
		var sidediv = document.getElementById('schoolInfo');
		sidediv.innerHTML = text;
	};

	var myLocationMarker = new google.maps.Marker({
		map: map,
		title: 'You are here.'
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			myLocationMarker.setPosition(me);
			map.setCenter(me);
		}, function(error) {
			console.log(error);
		});
	} 
};
$(window).load(function(){
    // Populate map after window has been loaded. 
    initMap();
});*/