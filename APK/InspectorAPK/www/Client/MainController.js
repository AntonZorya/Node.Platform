app.controller('MainController', ['$window', '$timeout', '$scope', '$route', '$http', 'indexedDBDataSvc',
	function($window, $timeout, $scope, $route, $http, indexedDBDataSvc){
		var vm = this;
		vm.objects=[];
		
		vm.oneObject;
		vm.oneCounter;
		vm.oneReadings;
		
		vm.objectId;
		
		vm.tickInterval = 1000;

		$scope.tick = function() {
	$scope.clock = Date.now(); // get the current time
	$timeout($scope.tick, vm.tickInterval); // reset the timer
};

var req = 
{
	method: 'GET',
	url: 'http://localhost:8080/api/identity/objects',
	headers: 
	{
		'Content-Type': 'application/json'
	},
	data: {}
};

$http(req).success(function(){
	console.log('everything is just ok');
}).
error(function(err){
	console.log(err);
});

  // Start the timer
  $timeout($scope.tick, vm.tickInterval);
  
  
  vm.refreshList = function(){
  	indexedDBDataSvc.getObjects().then(function(data){
  		vm.objects=data;
  	}, function(err){
  		$window.alert(err);
  	});
  };
  
  vm.getDefiniteObject = function(id){
  	indexedDBDataSvc.getDefiniteObject().then(function(data){
  		vm.oneObject = data;
  	}, function(err){
  		$window.alert(err);
  	});
  };
  
  vm.getDefiniteReadings = function(readings){
  	vm.oneReadings = readings;
  };
  
  vm.getDefiniteCounter = function(counter){
  	vm.oneCounter = counter;
  	vm.getDefiniteReadings(counter.readings);
  };
  
  vm.addSomeObjects = function(){
  	var obj1 = {
  		"contractNum": '110',
  		"objName": 'Библиотека',
  		"objAddress": 'г.Астана, р-н , ул. Пушкина,13(Гумилева,6) Библиотека',
  		"counters":[{
  			"serial": 'г14DA093101',
  			"module": '14-0875003-182',
  			"diameter": 15.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 8.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'г11736402',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 5943.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'г11736304',
  			"module": '-',
  			"diameter": 30.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 79.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": '01703304г',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 68.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'х11736540',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 775.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'х11736501',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 1022.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": '01594543х',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 5943.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'х1176467',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 5943.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},
  		{
  			"serial": 'г11736413',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 5943.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj2 = {
  		"contractNum": '111',
  		"objName": 'подст."Левобережье"',
  		"objAddress": 'г.Астана, р-н , ул. Левобережная,в р-не 2-й автодороги',
  		"counters":[{
  			"serial": '02173287',
  			"module": '-',
  			"diameter": 20.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 210547.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj3 = {
  		"contractNum": '111',
  		"objName": 'офисное помещение в Градокомплексе №3',
  		"objAddress": 'г.Астана, р-н , ул. Сауран (ул.78-я),дом 7б,ВП-1',
  		"counters":[{
  			"serial": 'г14DA093101',
  			"module": '-',
  			"diameter": 20.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 210547.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},{
  			"serial": 'г11736402',
  			"module": '-',
  			"diameter": 15.00,
  			"inUse": 'Нет',
  			"capacity": '',
  			"readings":[{
  				"reading": 1112.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj4 = {
  		"contractNum": '111',
  		"objName": 'подстанция "Новая"',
  		"objAddress": 'г.Астана, р-н , ул. Домалак Ана,7',
  		"counters":[{
  			"serial": '14UB003796',
  			"module": '-',
  			"diameter": 20.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 67.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj5 = {
  		"contractNum": '110',
  		"objName": 'Библиотека',
  		"objAddress": 'г.Астана, р-н , ул. Пушкина,13(Гумилева,6) Библиотека',
  		"counters":[{
  			"serial": '0147919',
  			"module": '-',
  			"diameter": 20.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 8884.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj6 = {
  		"contractNum": '110',
  		"objName": 'Учебный корпус №3 (ЦИСИ)',
  		"objAddress": 'г.Астана, р-н , ул. Кажымукана 13 Уч.корпус№3',
  		"counters":[{
  			"serial": '13FE022560B',
  			"module": '-',
  			"diameter": 40.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 16887.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj7 = {
  		"contractNum": '110',
  		"objName": 'общежитие на 250 мест',
  		"objAddress": 'г.Астана, р-н , ул. Янушкевича,4/1 (6) (общ.№6)',
  		"counters":[{
  			"serial": 'I11SD076805W',
  			"module": '-',
  			"diameter": 32.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 12965.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj8 = {
  		"contractNum": '110',
  		"objName": 'Главный корпус',
  		"objAddress": 'г.Астана, р-н , ул. Мунайтпасова,11(5)Главный корпус №1',
  		"counters":[{
  			"serial": '0859988х',
  			"module": '-',
  			"diameter": 40.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 210547.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	var obj9 = {
  		"contractNum": '110',
  		"objName": 'Дом студентов',
  		"objAddress": 'г.Астана, р-н , ул. Жумабаева 14 Общеж-е. №4',
  		"counters":[{
  			"serial": '103Е093046',
  			"module": '-',
  			"diameter": 40.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 254511.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		},{
  			"serial": 'i11SD076441',
  			"module": '-',
  			"diameter": 30.00,
  			"inUse": 'Да',
  			"capacity": '',
  			"readings":[{
  				"reading": 5943.00,
  				"readingDate": new Date(),
  				"wasOnline": false
  			}]
  		}]
  	};
  	indexedDBDataSvc.addObject(obj1).then(function(){
  		indexedDBDataSvc.addObject(obj2);
  		indexedDBDataSvc.addObject(obj3);
  		indexedDBDataSvc.addObject(obj4);
  		indexedDBDataSvc.addObject(obj5);
  		indexedDBDataSvc.addObject(obj6);
  		indexedDBDataSvc.addObject(obj7);
  		indexedDBDataSvc.addObject(obj8);
  		indexedDBDataSvc.addObject(obj9);
  		vm.refreshList();
  	},
  	function(err){
  		$window.alert(err);
  	});
  };
  
  vm.addObject = function(){
  	var obj = {
  		"contractNum": vm.contractNum,
  		"objName": vm.objName,
  		"objAddress": vm.objAddress,
  		"counters": vm.counters
  	};
  	indexedDBDataSvc.addObject(obj).then(function(){
  		vm.refreshList();
  		vm.contractNum="";
  		vm.objName="";
  		vm.objAddress="";
  		vm.serial="";
  		vm.module="";
  		vm.diameter="";
  		vm.inUse="";
  		vm.capacity="";
  		vm.lastReading="";
  	}, function(err){
  		$window.alert(err);
  	});
  };
  
  vm.deleteObject = function(id){
  	indexedDBDataSvc.deleteObject(id).then(function(){
  		vm.refreshList();
  	}, function(err){
  		$window.alert(err);
  	});
  };
  
  vm.addReading = function(id, serial, reading){
  	indexedDBDataSvc.addReadingToObject(id, serial, reading).then(function(){
  		vm.getDefiniteObject(id);
  		vm.newReading = "";
  	}, function(err){
  		$window.alert(err);
  	});
  };
  
  function init(){
  	indexedDBDataSvc.open().then(function(){
  		vm.refreshList();
  	});
  };
  
  init();
}]);
