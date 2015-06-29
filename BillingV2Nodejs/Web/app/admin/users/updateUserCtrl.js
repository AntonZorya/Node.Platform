function updateUserCtrl($scope, $rootScope, dataSvc, validSvc, $location, $route)
{
	validSvc.init($scope);

	var self = this;

	$scope.roles = [
	{sysName: "organizationAdmin", displayName: "#organizationAdmin"},
	{sysName: "organizationUser", displayName: "#organizationUser" },
	];


	this.container = $("#updateUserForm");


	dataSvc.get("/identity/user", {id: $route.current.params.id}, self.container).then(function(res) {
		$scope.vm = res.result;
		self.setSelectedRoles();
	});

	this.setSelectedRoles = function() {
		_.each($scope.roles, function(role) {
			if (_.contains($scope.vm.roles, role.sysName))
				role.checked = true;
		});
	}

	
	this.selectedRoles = function() {
		return _.map(_.where($scope.roles, {checked: true}), function(role) {
			return role.sysName;
		});
	}


	$scope.update = function() {
		$scope.vm.roles = self.selectedRoles();
		dataSvc.post("/identity/user/update", $scope.vm, self.container, $scope).then(function(res) {
			$location.path("/admin/users");
		});

	}

	$scope.cancel = function() {
		$location.path("/admin/users");
	}

	$scope.isChecked = function(role) {
		return _.some($scope.vm.roles, function(r) {
			return r.sysName === role.sysName;
		})
	}


	


}


billingApplication.controller("updateUserCtrl", ["$scope", "$rootScope", "dataService", "validationSvc", "$location","$route", updateUserCtrl]);

