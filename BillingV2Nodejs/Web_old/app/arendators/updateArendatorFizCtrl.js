arndApplication.controller('updateArendatorFizCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', '$location', '$route', updateArendatorFizCtrl]);

function updateArendatorFizCtrl(dataSvc, $scope, valSvc, modalSvc, $location, $route) {
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

	dataSvc.get("/clientFiz", {id: $route.current.params.id}, $("#updateArendatorFizForm")).then(function(res) {
		$scope.clientFiz = res.result;
	});

	$scope.likeRadio = function(phone){
		_.each($scope.clientFiz.phones, function(phoneFromList){
			if(phone!==phoneFromList){
				phoneFromList.isMain=false;
			}
		});
	}

	$scope.save = function(){
		dataSvc.post("/clientFiz/update", $scope.clientFiz, $("#updateArendatorFizForm"), $scope).then(function(data){
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