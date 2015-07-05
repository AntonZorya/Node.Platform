
billingApplication.controller('translateCtrl', ['dataService', '$scope','validationSvc', translateCtrl]);

function translateCtrl(dataSvc, $scope, valSvc) {
	valSvc.init($scope);
	$scope.vm = this;
	$scope.languages = [];
	$scope.translations = [];

	dataSvc.get("/languages",{}).then(function(langData){
		$scope.languages = langData.result;

		dataSvc.get("/translations",{}).then(function(data){
			_.each(data.result,function(trans){

				_.each($scope.languages, function(lang){
					if(!_.find(trans.translate, function(elem){
						return elem.languageCode == lang.languageCode;
					})){
						trans.translate.push({languageCode: lang.languageCode, text: ""});

					}
				});
			});
			$scope.translations = data.result;

		});
	});


	$scope.addTranslation = function(){

		var translate = [];
		_.each($scope.languages, function(lang){
			translate.push({languageCode: lang.languageCode, text:""});
		});
		var emptyTranslation = {text:"", translate};
		$scope.translations.unshift(emptyTranslation);
	}

	$scope.saveAll = function(){

		var dataToSend = {"translations":$scope.translations};

		dataSvc.post("/translations", dataToSend, $("#translationsTable"), $scope).then(function(data){
			
			dataSvc.get("/languages",{}).then(function(langData){
				$scope.languages = langData.result;

				dataSvc.get("/translations",{}).then(function(data){
					_.each(data.result,function(trans){

						_.each($scope.languages, function(lang){
							if(!_.find(trans.translate, function(elem){
								return elem.languageCode == lang.languageCode;
							})){
								trans.translate.push({languageCode: lang.languageCode, text: ""});

							}
						});
					});
					$scope.translations = data.result;

				});
			});
		});
	}
}
