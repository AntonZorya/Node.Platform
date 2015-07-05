arndApplication.controller('addLanguageCtrl', ['dataService', '$scope','validationSvc', 'modalSvc', languagesCtrl]);

function languagesCtrl(dataSvc, $scope, valSvc, modalSvc) {
	$scope.header = "#addLanguage";
	valSvc.init($scope);
	$scope.language = {languageCode: "", name:"", flagName:""};

	$scope.clickOk = function(){

		dataSvc.post("/language/add", $scope.language, $("#addLanguageForm"), $scope).then(function(data){
			modalSvc.closeModal("languageAddModal");
		});

	}

	$scope.clickCancel = function(){
		modalSvc.resolveModal("languageAddModal");
	}

}