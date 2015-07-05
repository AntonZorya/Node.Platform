function addFacilityCtrl($scope, $location, dataSvc, validationSvc, $rootScope, addFacilityData) {
	var self = this;
	this.container = $("#addFacilityContainer");
	validationSvc.init($scope);

	if (addFacilityData.facilityType == null ||  !$rootScope.user ||  !$rootScope.user.organizationId === "")
		$location.path("/facilities");

	$scope.facilityTypeName = addFacilityData.facilityType.name;

	$scope.vm = {
		name: "",
		description: "",
		facilityTypeId: addFacilityData.facilityType._id,
		organizationId: $rootScope.user.organizationId
	}


	$scope.save =  function() {
		dataSvc.post("/facility/add", $scope.vm, self.container, $scope).then(function(res) {
			if (res.operationResult === 0)
			{
				//addFacilityData.facilityType = null;
				//addFacilityData.organizaitionId = '';
				$location.path("/facilities");
			}
		});
	}


}


arndApplication.controller('addFacilityCtrl', ['$scope', '$location', 'dataService', 'validationSvc','$rootScope', 'addFacilityData', addFacilityCtrl]);