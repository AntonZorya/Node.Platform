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


	$scope.karimovChartConfig = {
		options: dashboardChartObptions,
		series: [{
			data: [4, 5, 0, 12, 18],
			tooltip: {

				headerFormat: "",
				pointFormat: 'Даяров Алмабек :{point.y}<br>'
			}
		},

			{
			data: [9, 0, 4, 5, 12],
			tooltip: {

				headerFormat: "",
				pointFormat: 'Бекбалаев Максат :{point.y}<br>'
			}}
		]
	}

	

}
