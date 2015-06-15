app.controller('CounterController', ['$scope', '$route', 'indexedDBDataSvc',
	function($scope, $route, indexedDBDataSvc){
		var vm = this;
		
		vm.Object;
		vm.newReading;
		
		vm.getDefiniteObject = function(){
			indexedDBDataSvc.getDefiniteObject($route.current.params.objectId).then(function(data){
				vm.Object = data[data.length-1];
				$scope.objectId = vm.Object.id;
			}, function(error){
				$window.alert(error);
			});
		};
		
		vm.addReading = function(id, serial, reading, lastReading){
			if(reading != ""){
				if(parseFloat(reading) > parseFloat(lastReading)){
					  indexedDBDataSvc.addReadingToObject(id, serial, reading).then(function(){
						  vm.getDefiniteObject(id);
						  vm.newReading = "";
					  }, function(err){
						  $window.alert(err);
					  });
				}
				else{
					alert("Значение не может быть меньше последнего показания.");
				}
			}
			else{
				alert("Это поле не может быть пустым.");
			}
		};
		
		function init(){
			indexedDBDataSvc.open().then(function(){
				vm.getDefiniteObject();
			});
		};
		
		init();
	}
]);