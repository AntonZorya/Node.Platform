arndApplication.controller('mainCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', mainCtrl]);

function mainCtrl(dataSvc, $scope, valSvc, modalSvc) {
	valSvc.init($scope);
	//dataSvc.post("/finance/accruel", { a: "a" }, $("#main_page"), $scope).then(function () { alert("allOk"); });

	$scope.clicked = function(){
		modalSvc.yesNoModal("bomb", "#Че там?", "#Че делать то?", "#На кол суку", "#Похуй пляшем", $scope).then(function(data){
			alert(data);
		});
	}

	$scope.checkDelete =function(){
		dataSvc.delete("/identity/hui", 1, $("#main_page"));
	}


	$('.menu .item')
		.tab()
	;


	var dashboardChartObptions = {
		chart: {
			renderTo: this,
			backgroundColor: null,
			borderWidth: 0,
			type: 'area',
			margin: [2, 0, 2, 0],
			width: 230,
			height: 40,
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
			data: [5000, 6700, 0, 4600, 15000],
			tooltip: {

				headerFormat: "",
				pointFormat: '<span style="font-size: 10px">Оплата :{point.y}</b> тг.<br>'
			}
		},
			{
				data: [7500, 7500, 0, 0, 7500],
				tooltip: {

					pointFormat: '<span style="font-size: 10px">Начисления :{point.y}</b> тг.<br>'
				}
			},
			{
				negativeColor: '#910000',
				data: [0, 2000, 0, 0, 7500],
				tooltip: {

					pointFormat: '<span style="font-size: 10px">Баланс :{point.y}</b> тг.<br>'
				}
			},
		]
	}

	$scope.zoryaChartConfig = {
		options: dashboardChartObptions,
		series: [{
			data: [7500, 6700, 0, 0, 0],
			tooltip: {

				headerFormat: "",
				pointFormat: '<span style="font-size: 10px">Оплата :{point.y}</b> тг.<br>'
			}
		},
			{
				data: [7500, 7500, 0, 0, 7500],
				tooltip: {

					pointFormat: '<span style="font-size: 10px">Начисления :{point.y}</b> тг.<br>'
				}
			},
			{
				negativeColor: '#910000',
				data: [0, -2000, 0, 0, -9500],
				tooltip: {

					pointFormat: '<span style="font-size: 10px">Баланс :{point.y}</b> тг.<br>'
				}
			},
		]
	}


	$(".popup").popup();





}