angular.module('ConfusedApp')
.directive('mainpage', function ($log) {
	return {
		replace: true,
		restrict: 'E',
		templateUrl: 'views/mainpage.html'
	};
});
