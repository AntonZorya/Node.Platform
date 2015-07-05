arndApplication.controller('updateArendatorJurCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', '$location', '$route', updateArendatorJurCtrl]);

function updateArendatorJurCtrl(dataSvc, $scope, valSvc, modalSvc, $location, $route) {
	
	valSvc.init($scope);
	$scope.clientJur = {
		name: "",
		registrationDate: "",
		bin: "",
		registrationCertificateNumber: "",
		jurAddress: "",
		factAddress: "",
		phones: [{phoneNumber:"",phoneDescription:"",isMain:false}]
	};

	$(".popup").popup();

	dataSvc.get("/clientJur", {id: $route.current.params.id}, $("#updateArendatorJurForm")).then(function(res) {
		$scope.clientJur = res.result;
	});

	$scope.likeRadio = function(phone){
		_.each($scope.clientJur.phones, function(phoneFromList){
			if(phone!==phoneFromList){
				phoneFromList.isMain=false;
			}
		});
	}

	$scope.save = function(){
		dataSvc.post("/clientJur/update", $scope.clientJur, $("#updateArendatorJurForm"), $scope).then(function(data){
			if (data.operationResult === 0)
			{
				$location.path("/arendators");
			}
		});
	}

	$scope.addPhone = function(){
		$scope.clientJur.phones.push({phoneNumber:"",phoneDescription:"",isMain:false});
	}

	$scope.removePhone = function(index){
		if($scope.clientJur.phones.length>1)
			$scope.clientJur.phones.splice(index, 1);
	}

}