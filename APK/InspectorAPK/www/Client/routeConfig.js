app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'mainTable.html',
			controller: 'MainController'
		})
		.when('/objects/:objectId/counters',{
			templateUrl: 'counters.html',
			controller: 'CounterController'
		})
		.when('/objects/:objectId/counters/:counterSerial/history',{
			templateUrl: 'history.html',
			controller: 'HistoryController'
		});
}]);