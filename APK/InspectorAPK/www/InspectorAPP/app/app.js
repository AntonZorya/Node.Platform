var InspectorAPP = angular.module('InspectorAPP', ['ngRoute']).config(['$routeProvider', function (routeProvider) {
	routeProvider
	.otherwise({
		redirectTo: '/login'
	}).when("/test", {
		templateUrl: "app/test/test.html"
	}).when("/login", {
		templateUrl: "app/login/login.html"
	});
}]);