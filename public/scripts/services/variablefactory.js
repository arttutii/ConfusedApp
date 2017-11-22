app.factory('VariableFactory', function($log) {
	// This module stores variables that can be generally used elsewhere

	// Map object 	
	let map;
	let user;
	let myLocationMarker;

	return {
		map,
		user,
		myLocationMarker
	};

});