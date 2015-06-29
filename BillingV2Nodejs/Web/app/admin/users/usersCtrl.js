function usersCtrl($scope, dataSvc, $rootScope, $location) {
	var self = this;
	this.container = $("#userContainer");



	$scope.data = [];


	


	$scope.getData = function() {
		dataSvc.get("/identity/users", {organizationId: $rootScope.user.organizationId}, self.container).then(function(res) {
			$scope.data = res.result;
		});
	};

	$scope.$watch(function() {
		return $rootScope.user;
	}, function() {
		if ($rootScope.user)
			$scope.getData();
	});


	$scope.add = function() {
		$location.path("/admin/users/add");
	}

	$scope.changePassword = function() {

	}

	$scope.update = function(user) {
		$location.path("/admin/users/update" + user._id);
	}



}


billingApplication.controller('usersCtrl', ['$scope', 'dataService', '$rootScope', '$location', usersCtrl]);