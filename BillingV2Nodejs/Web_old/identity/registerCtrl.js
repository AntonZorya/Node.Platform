function registerCtrl($scope, dataSvc, $location, valSvc) {
	valSvc.init($scope);
	var self = this;

	$scope.vm = {
		org: {
			organizationName: "",
			bin: "",
			description: ""
		},
		user: {
			userName: "",
			password: "",
			email: ""
		}
	}


	$scope.register = function() {
		if ($scope.passwordConfirmation !== $scope.vm.password)
			$scope.commonErrors.push("#password not confirmed");

		dataSvc.post("/identity/register", $scope.vm, $("#loginForm"), $scope).then(function(res) {
			if (res.operationResult === 0)
				$location.path("/login");
		});
	}

	$("#registerWindow").transition('drop');


}

arndApplication.controller('registerCtrl', ['$scope', 'dataService', '$location', 'validationSvc', registerCtrl]);