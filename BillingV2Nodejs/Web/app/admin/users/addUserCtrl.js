billingApplication.controller("addUserCtrl", ["$scope", "$rootScope", "dataService", "validationSvc", "$location", addUserCtrl]);

function addUserCtrl($scope, $rootScope, dataSvc, validSvc, $location)
{
	validSvc.init($scope);

	var self = this;

	$scope.roles = [
		{sysName: "organizationUser", displayName: "#organizationUser"},
		{sysName: "client", displayName: "#client"},
		{sysName: "operatorJuridical", displayName: "#operatorJuridical"},
		{sysName: "operatorFizical", displayName: "#operatiorFizical"}
	];


	this.container = $("#addUserForm");

	
	this.selectedRoles = function() {
		return _.map(_.where($scope.roles, {checked: true}), function(role) {
			return role.sysName;
		});
	}

	$scope.vm = {

		roles: self.selectedRoles()
	};


	$scope.add = function() {
		//$scope.vm.organizationId = $rootScope.user.organizationId;

		if ($scope.passwordConfirmation !== $scope.vm.password)
		{
			$scope.commonErrors = ["#password confirmation error"];
			return;
		}
		$scope.vm.roles = self.selectedRoles();
		dataSvc.post("/identity/user", $scope.vm, self.container, $scope).then(function(res) {
			$location.path("/administration/users");
		});

	}

	$scope.cancel = function() {
		$location.path("/administration/users");
	}

	$scope.isChecked = function(role) {
		return _.some($scope.vm.roles, function(r) {
			return r.sysName === role.sysName;
		})
	}


	


}




