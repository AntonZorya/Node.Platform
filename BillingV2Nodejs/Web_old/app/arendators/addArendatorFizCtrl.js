arndApplication.controller('addArendatorFizCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', '$location', addArendatorFizCtrl]);

function addArendatorFizCtrl(dataSvc, $scope, valSvc, modalSvc, $location) {
	
	valSvc.init($scope);
	$scope.clientFiz = {
		iin: "", 
		firstName: "", 
		lastName: "", 
		middleName: "", 
		birthDate: "", 
		homeAddress: "", 
		registrationAddress: "", 
		phones: [{phoneNumber:"",phoneDescription:"",isMain:false}]
	};

	$(".popup").popup();

	$scope.likeRadio = function(phone){
		_.each($scope.clientFiz.phones, function(phoneFromList){
			if(phone!==phoneFromList){
				phoneFromList.isMain=false;
			}
		});
	}

	$scope.save = function(){
		dataSvc.post("/clientFiz/add", $scope.clientFiz, $("#addArendatorFizForm"), $scope).then(function(data){
			if (data.operationResult === 0)
			{
				$location.path("/arendators");
			}
		});
	}

	$scope.addPhone = function(){
		$scope.clientFiz.phones.push({phoneNumber:"",phoneDescription:"",isMain:false});
	}

	$scope.removePhone = function(index){
		if($scope.clientFiz.phones.length>1)
			$scope.clientFiz.phones.splice(index, 1);
	}

}