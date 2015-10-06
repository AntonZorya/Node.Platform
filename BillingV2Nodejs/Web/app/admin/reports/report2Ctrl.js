billingApplication.controller('report2Ctrl', ['dataService', '$scope','validationSvc', report2Ctrl]);

function report2Ctrl(dataSvc, $scope, valSvc) {

	$scope.resultTotals = {};
	$scope.result = [];
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

	//DECLARE LOGIC



	$scope.getReport = function(year, month){
		//prepare period variable //ex: 201507
		month++;
		if(month<10) month="0"+month;
		var period = ""+year+month;
		$scope.resultTotals = {};

		dataSvc.get("/report2", {period: period}, $("#container")).then(function(res) {
			$scope.result = res.result;
			$scope.resultTotals.passed = 0;
			$scope.resultTotals.sumWaterCubic = 0;
			$scope.resultTotals.sumCanalCubic = 0;
			$scope.resultTotals.sumWaterMoney = 0;
			$scope.resultTotals.sumCanalMoney = 0;
			$scope.resultTotals.sumForfeitMoney = 0;
			$scope.resultTotals.sumTotalMoney = 0;

			_.each(res.result, function(elem){
				console.log(parseFloat(elem.passed));
				console.log(parseFloat(elem.sumWaterCubic));
				if(elem.passed)
				$scope.resultTotals.passed += parseFloat(elem.passed);
				if(elem.sumWaterCubic)
				$scope.resultTotals.sumWaterCubic += parseFloat(elem.sumWaterCubic);
				if(elem.sumCanalCubic)
				$scope.resultTotals.sumCanalCubic += parseFloat(elem.sumCanalCubic);
				if(elem.sumWaterMoney)
				$scope.resultTotals.sumWaterMoney += parseFloat(elem.sumWaterMoney);
				if(elem.sumCanalMoney)
				$scope.resultTotals.sumCanalMoney += parseFloat(elem.sumCanalMoney);
				if(elem.sumForfeitMoney)
				$scope.resultTotals.sumForfeitMoney += parseFloat(elem.sumForfeitMoney);
				if(elem.sumTotalMoney)
				$scope.resultTotals.sumTotalMoney += parseFloat(elem.sumTotalMoney);
			});

			$scope.resultTotals.passed = $scope.resultTotals.passed.toFixed(2);
			$scope.resultTotals.sumWaterCubic = $scope.resultTotals.sumWaterCubic.toFixed(2);
			$scope.resultTotals.sumCanalCubic = $scope.resultTotals.sumCanalCubic.toFixed(2);
			$scope.resultTotals.sumWaterMoney = $scope.resultTotals.sumWaterMoney.toFixed(2);
			$scope.resultTotals.sumCanalMoney = $scope.resultTotals.sumCanalMoney.toFixed(2);
			$scope.resultTotals.sumForfeitMoney = $scope.resultTotals.sumForfeitMoney.toFixed(2);
			$scope.resultTotals.sumTotalMoney = $scope.resultTotals.sumTotalMoney.toFixed(2);


		});
	};

	$scope.initDate = function(){
		var currentDate = new Date();
		$scope.selectedMonth = $scope.monthList[currentDate.getMonth()];
		$scope.selectedYear = _.find($scope.yearList, function(year){ return year.id == currentDate.getFullYear(); });
		$scope.getReport($scope.selectedYear.id,$scope.selectedMonth.id);
	};
	$scope.initDate();


	

}
