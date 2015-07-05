arndApplication.controller('addArendatorJurCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', '$location', addArendatorJurCtrl]);

function addArendatorJurCtrl(dataSvc, $scope, valSvc, modalSvc, $location) {
	
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

	$scope.likeRadio = function(phone){
		_.each($scope.clientJur.phones, function(phoneFromList){
			if(phone!==phoneFromList){
				phoneFromList.isMain=false;
			}
		});
	}

	$scope.save = function(){
		dataSvc.post("/clientJur/add", $scope.clientJur, $("#addArendatorJurForm"), $scope).then(function(data){
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