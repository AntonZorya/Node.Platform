billingApplication.controller('report1Ctrl', ['dataService', '$scope','validationSvc', report1Ctrl]);

function report1Ctrl(dataSvc, $scope, valSvc) {


	$scope.controllersList = [];
	$scope.days = getDaysInMonth(6,2015);
	$scope.data = [];


	dataSvc.get("/controllers", {}, $("#container")).then(function(res) {
		$scope.controllersList = res.result;


		dataSvc.get("/report", {period: 201506}, $("#container")).then(function(res) {
			$scope.data = res;
			console.log($scope.data);


		});

	});

	function getDaysInMonth(month, year) {
	     var date = new Date(year, month, 1, 6, 0, 0);
	     var days = [];
	     var iter=1;
	     while (date.getMonth() === month) {
	     	dayAsStr = new Date(date).getFullYear().toString() + "-0" + (new Date(date).getMonth()+1).toString() + "-" + ((iter < 10) ? ("0"+iter) : iter);
	        days.push(dayAsStr);
	        date.setDate(date.getDate() + 1);
	        iter++;
	     }
	     return days;
	}

	$scope.getCounts = function(day,con){
		var look = _.findWhere($scope.data, {controllerId: con, date: day});
		if(look){
			console.log(day,con,look);
			return look.total;
		}
	}

	

}
