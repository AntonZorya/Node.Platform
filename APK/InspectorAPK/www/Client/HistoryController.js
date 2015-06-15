app.controller('HistoryController', ['$route', 'indexedDBDataSvc',
	function($route, indexedDBDataSvc){
		var vm = this;
		
		vm.Counter;

		vm.getDefiniteCounter = function(){
			indexedDBDataSvc.getDefiniteObject($route.current.params.objectId).then(function(data){
				var obj = data[data.length-1];
				var counters = obj.counters;
				for(var i=0; i<counters.length; i++){
					if(counters[i].serial == $route.current.params.counterSerial){
						vm.Counter = counters[i];
						break;
					}
				}
			}, function(error){
				$window.alert(error);
			});
		};
		
		function init(){
			indexedDBDataSvc.open().then(function(){
				vm.getDefiniteCounter();
			});
		};
		
		init();
	}
]);
