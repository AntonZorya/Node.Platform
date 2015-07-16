billingApplication.controller('report2Ctrl', ['dataService', '$scope','validationSvc', report2Ctrl]);

function report2Ctrl(dataSvc, $scope, valSvc) {


	$scope.controllersList = [];
	$scope.days = getDaysInMonth(6,2015);
	$scope.data = [];
	$scope.series = [];


	dataSvc.get("/controllers", {}, $("#container")).then(function(res) {
		$scope.controllersList = res.result;


		dataSvc.get("/reportCounts", {period: 201506}, $("#container")).then(function(res) {
			$scope.data = res;

			for(var j=0;j<$scope.controllersList.length;j++){
				// var temObj = {};
				// tempObj.tooltip.headerFormat="";
				// tempObj.tooltip.pointFormat=$scope.controllersList[j].fullName+':{point.y}<br>';
				var tempArr = [];

				for(var i=0;i<$scope.days.length;i++){
					
					tempArr.push($scope.getCounts2($scope.days[i], $scope.controllersList[j].fullName));
				}

				$scope.series.push({
					data: tempArr,
					tooltip: {

						headerFormat: "",
						pointFormat: $scope.controllersList[j].fullName+':{point.y}<br>'
					}
				});

			}



			$scope.karimovChartConfig = {
				options: dashboardChartObptions,
				series: $scope.series
			}


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




	var dashboardChartObptions = {
		chart: {
			renderTo: this,
			backgroundColor: null,
			borderWidth: 0,
			type: 'area',
			margin: [2, 0, 2, 0],
			width: 1000,
			height: 300,
			style: {
				overflow: 'visible'
			},
			skipClone: true
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		xAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: []
		},
		yAxis: {
			endOnTick: false,
			startOnTick: false,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickPositions: [0]
		},
		legend: {
			enabled: false
		},
		tooltip: {
			backgroundColor: null,
			borderWidth: 0,
			shadow: false,
			useHTML: true,
			hideDelay: 0,
			shared: true,
			padding: 0,
			positioner: function (w, h, point) {
				return {x: point.plotX - w / 2, y: point.plotY - h};
			}
		},
		plotOptions: {
			series: {
				animation: false,
				lineWidth: 1,
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				marker: {
					radius: 1,
					states: {
						hover: {
							radius: 2
						}
					}
				},
				fillOpacity: 0.25
			},
			column: {
				negativeColor: '#910000',
				borderColor: 'silver'
			}
		}


	};



	

}
