arndApplication.controller('arendatorsCtrl', ['dataService', '$scope','validationSvc','modalSvc', "$location", arendatorsCtrl]);

function arendatorsCtrl(dataSvc, $scope, valSvc, modalSvc, $location) {
	valSvc.init($scope);
	$scope.vm = this;
	$scope.modelsFiz = [];
	$scope.modelsJur = [];
	$('.menu .item').tab();
	$('.popup').popup({
		position : 'top right'
	});

	dataSvc.get("/clientsFiz", null, $("#clientsFizContainer")).then(function(data){
		$scope.modelsFiz = data.result;
	});
	dataSvc.get("/clientsJur", null, $("#clientsJurContainer")).then(function(data){
		$scope.modelsJur = data.result;
	});

	$scope.addFiz = function()
	{
		$location.path("/arendators/fiz/add");
	}

	$scope.addJur = function()
	{
		$location.path("/arendators/jur/add");
	}

	$scope.updateFiz = function(model)
	{
		$location.path("/arendators/fiz/update"+model._id);
	}

	$scope.updateJur = function(model)
	{
		$location.path("/arendators/jur/update"+model._id);
	}

	$scope.deleteFiz = function(model)
	{
		modalSvc.yesNoModal("warning sign", "#removeArendatorFiz?", "#areYouSureYouWantRemoveArendatorFiz?", "#cancel", "#ok", $scope).then(function(data){
			if(data){
				dataSvc.delete("/clientFiz", {id: model._id}, $("#clientsFizContainer")).then(function(res) {
					dataSvc.get("/clientsFiz", null, $("#clientsFizContainer")).then(function(data){
						$scope.modelsFiz = data.result;
					});
				});
			}
		});
	}

	$scope.deleteJur = function(model)
	{
		modalSvc.yesNoModal("warning sign", "#removeArendatorJur?", "#areYouSureYouWantRemoveArendatorJur?", "#cancel", "#ok", $scope).then(function(data){
			if(data){
				dataSvc.delete("/clientJur", {id: model._id}, $("#clientsJurContainer")).then(function(res) {
					dataSvc.get("/clientsJur", null, $("#clientsJurContainer")).then(function(data){
						$scope.modelsJur = data.result;
					});
				});
			}
		});
	}

	$scope.getMainPhoneNumber = function(phones){
		var mainPhone = _.find(phones, function(phone){
			return phone.isMain == true;
			
		});
		if(mainPhone) return mainPhone.phoneNumber
			else return "#phoneNumberNotFound";
	}
}