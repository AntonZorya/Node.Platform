function updateFacilityCtrl($scope, $location, dataSvc, validationSvc, $route, addData) {
	var self = this;
	validationSvc.init($scope);


	dataSvc.get("/facility", {id: $route.current.params.id}, $("#updateFacilityContainer")).then(function(res) {
		$scope.vm = res.result;
		addData.facilityType = $scope.vm.facilityTypeId;
	});


	$scope.cancel = function() {

		$location.path("/facilities");
	}

	$scope.save =  function() {
		dataSvc.post("/facility/update", $scope.vm, $("#updateFacilityContainer"), $scope).then(function(res) {

		});
	}


	$('.menu .item').tab();

}


arndApplication.controller('updateFacilityCtrl', ['$scope', '$location', 'dataService', 'validationSvc', '$route', 'addFacilityData', updateFacilityCtrl]);