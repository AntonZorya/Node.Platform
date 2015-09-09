billingApplication.controller('report1Ctrl', ['dataService', '$scope','validationSvc', report1Ctrl]);

function report1Ctrl(dataSvc, $scope, valSvc) {

	//DECLARE VARS
	$scope.chartOptions = {
		title: {
			text: ''
		},
		xAxis: {
			allowDecimals: false,
			title: {
				text: ''
			},
			categories: $scope.daysArray,
			tickInterval: 3
		},
		yAxis: {
			title: {
				text: 'Количество пройденных объектов'
			},
			allowDecimals: false,
			min: 0
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		}
	};
	$scope.controllersList = [];
	$scope.yearList = [
		{ id: 2011, name: '2011' },
		{ id: 2012, name: '2012' },
		{ id: 2013, name: '2013' },
		{ id: 2014, name: '2014' },
		{ id: 2015, name: '2015' },
		{ id: 2016, name: '2016' },
		{ id: 2017, name: '2017' },
		{ id: 2018, name: '2018' },
		{ id: 2019, name: '2019' },
		{ id: 2020, name: '2020' }
	];
	$scope.monthList = [
		{ id: 0, name: 'Январь' },
		{ id: 1, name: 'Февраль' },
		{ id: 2, name: 'Март' },
		{ id: 3, name: 'Апрель' },
		{ id: 4, name: 'Май' },
		{ id: 5, name: 'Июнь' },
		{ id: 6, name: 'Июль' },
		{ id: 7, name: 'Август' },
		{ id: 8, name: 'Сентябрь' },
		{ id: 9, name: 'Октябрь' },
		{ id: 10, name: 'Ноябрь' },
		{ id: 11, name: 'Декабрь' }
	];
	$scope.selectedYear;
	$scope.selectedMonth;
	$scope.data = [];
	$scope.series = [];
	$scope.daysArray = [];
	$scope.minDate;
	$scope.maxDate;

	//DECLARE LOGIC
	$scope.initDate = function(){
		var currentDate = new Date();
		$scope.selectedMonth = $scope.monthList[currentDate.getMonth()];
		$scope.selectedYear = _.find($scope.yearList, function(year){ return year.id == currentDate.getFullYear(); });
	}
	$scope.initDate();

	$scope.getControllersList = function(){
		dataSvc.get("/controllers", {}, $("#container")).then(function(res) {
			$scope.controllersList = res.result;
			$scope.getVisitList($scope.selectedYear.id,$scope.selectedMonth.id);
		});
	};
	$scope.getControllersList();

	$scope.findUpperAndLowerDates = function(array){
		if(!Array.isArray(array) || array.length == 0){
			return false;
		}
		var minDate = new Date(array[0].date);
		var maxDate = new Date(array[0].date);
		for(var i=0; i<array.length;i++){
			var iterDate = new Date(array[i].date)
			if(minDate>iterDate) minDate=iterDate;
			if(maxDate<iterDate) maxDate=iterDate;
		}
		$scope.minDate = minDate;
		$scope.maxDate = maxDate;
		$scope.fillDays();
		return true;
	};

	$scope.fillDays = function(){
		var minMomentDate = moment($scope.minDate);
		var maxMomentDate = moment($scope.maxDate);
		$scope.daysArray = [];

		while(minMomentDate.isBefore(maxMomentDate) | minMomentDate.isSame(maxMomentDate)){
			$scope.daysArray.push(minMomentDate.format("YYYY-MM-DD"));
			minMomentDate.add(1,'days');
		}
	}

	$scope.getVisitList = function(year, month){
		//prepare period variable //ex: 201507
		month++;
		if(month<10) month="0"+month;
		var period = ""+year+month;

		dataSvc.get("/report1", {period: period}, $("#container")).then(function(res) {
			$scope.data = res;
			$scope.series = [];
			var success = $scope.findUpperAndLowerDates($scope.data);

			if(success){
				for(var j=0;j<$scope.controllersList.length;j++){
					var tempArr = [];

					for(var i=0;i<$scope.daysArray.length;i++){
						
						tempArr.push($scope.getCounts2($scope.daysArray[i], $scope.controllersList[j].fullName));
					}

					$scope.series.push({
						data: tempArr,
						name: $scope.controllersList[j].fullName
					});

				}
			}

			$scope.chartOptions.xAxis.categories = $scope.daysArray;
			$scope.highChartConfig = {
				options: $scope.chartOptions,
				series: $scope.series
			}
		});
	};
	
	$scope.getCounts = function(day,con){
		var look = _.findWhere($scope.data, {controllerId: con, date: day});
		if(look){
			return look.total;
		}
	}

	$scope.getCounts2 = function(day,con){
		var look = _.findWhere($scope.data, {controllerId: con, date: day});
		if(look){
			return look.total;
		}
		return 0;
	}

	$scope.getTotalCounts = function(con){
		var look = _.where($scope.data, {controllerId: con}).reduce(function(memo, num){ return memo + num.total; }, 0);
		if(look){
			return look;
		}
	}
}