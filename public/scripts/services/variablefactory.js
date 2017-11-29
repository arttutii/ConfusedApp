app.factory('VariableFactory', function($log) {
	// This module stores variables that can be generally used elsewhere

	// Map object 	
	let map, 
	user, 
	myLocationMarker,
	selectedSchool;


	return {
		map,
		user,
		myLocationMarker,
		selectedSchool
	};

});