'use strict';

// KML implementation with data, does not work
/*
var map, kml, kmlGeoms, bufferGraphics, gp;
    require([
      "esri/map", "esri/layers/KMLLayer", "esri/layers/GraphicsLayer",
      "esri/SpatialReference", "esri/graphic",
      "esri/tasks/GeometryService", "esri/tasks/Geoprocessor",
      "esri/tasks/BufferParameters", "esri/tasks/FeatureSet",
      "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
      "esri/urlUtils",
      "dojo/parser", "dojo/_base/array", "esri/Color", "dojo/_base/connect",
      "dojo/number", "dojo/dom", "dojo/dom-style", "dojo/dom-attr",

      "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
      "dojo/domReady!"
    ], function(
      Map, KMLLayer, GraphicsLayer,
      SpatialReference, Graphic,
      GeometryService, Geoprocessor,
      BufferParameters, FeatureSet,
      SimpleFillSymbol, SimpleLineSymbol,
      urlUtils,
      parser, arrayUtils, Color, connect,
      number, dom, domStyle, domAttr
    ) {

      urlUtils.addProxyRule({
        proxyUrl: "/proxy/",
        urlPrefix: "sampleserver1.arcgisonline.com"
      });

      map = new Map("map", {
        basemap: "topo",
        center: [-77.8, 39.3],
        zoom: 10
      });

      parser.parse();

      // Graphics layer for the buffer
      bufferGraphics = new GraphicsLayer();
      map.addLayer(bufferGraphics);

      var kmlUrl =
        "https://esri.box.com/shared/static/iiqwmrs9915iioa3j4tpmwo5nujwdj2i.kmz";
      kml = new KMLLayer(kmlUrl);
      map.addLayer(kml);

      // The geoprocessor
      var gpUrl =
        "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Population_World/GPServer/PopulationSummary";
      gp = new Geoprocessor(gpUrl);
      gp.setOutputSpatialReference({
        wkid: 102100
      });

      kml.on("load", function(evt) {
        // Collect the line features from the KML layer
        kmlGeoms = arrayUtils.map(evt.layer.getLayers()[0].graphics,
          function(g) {
            return g.geometry;
          });

        // Send to a function to do the buffer
        bufferKML();
      });

      // Re-calculate the buffer and population when buffer distance changes
      connect.connect(dom.byId("bufferDistance"), "onchange", bufferKML);

      function bufferKML() {
        bufferGraphics.clear();
        dom.byId("totalPop").innerHTML = "";
        domStyle.set("loading", "display", "inline-block");
        domAttr.set("bufferDistance", "disabled", true);

        var bufferDistance = dom.byId("bufferDistance").value;
        var params = new BufferParameters();
        params.geometries = kmlGeoms;
        params.distances = [bufferDistance];
        params.bufferSpatialReference = new SpatialReference({
          "wkid": 102100
        });
        params.outSpatialReference = map.spatialReference;
        params.unit = GeometryService.UNIT_STATUTE_MILE;
        params.unionResults = true;
        //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
        var gsUrl =
          "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
        var gs = new GeometryService(gsUrl);
        gs.buffer(params, showBuffer);
      }

      function showBuffer(buffer) {
        // Add the buffer graphic to the map
        var polySym = new SimpleFillSymbol()
          .setColor(new Color([56, 102, 164, 0.4]))
          .setOutline(
            new SimpleLineSymbol()
            .setColor(new Color([56, 102, 164, 0.8]))
          );
        var bufferGraphic = new Graphic(buffer[0], polySym);
        bufferGraphics.add(bufferGraphic);

        // Send buffer to runction to calculate population
        calcPop(bufferGraphic);
      }

      function calcPop(aoi) {
        // Create a feature set for the population zonal stats GP service
        var fset = new FeatureSet();
        fset.features = [aoi];

        var params = {
          "inputPoly": fset
        };
        gp.execute(params, handlePop);
      }

      function handlePop(result) {
        if (result[0] && result[0].value.features[0].attributes.hasOwnProperty(
            'SUM')) {
          var pop = number.format((result[0].value.features[0].attributes.SUM)
            .toFixed() + '');
          dom.byId('totalPop').innerHTML = pop;
        } else {
          alert("Unable to get population summary. Please try again.");
        }
        domStyle.set("loading", "display", "none");
        domAttr.set("bufferDistance", "disabled", false);
      }
  });*/

// esrimap version #1, geographical location center 

/*let map;
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
  });*/