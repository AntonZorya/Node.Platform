arndApplication.controller('languagesCtrl', ['dataService', '$scope','validationSvc','modalSvc', languagesCtrl]);

function languagesCtrl(dataSvc, $scope, valSvc, modalSvc) {
	valSvc.init($scope);
	$scope.vm = this;
	$scope.models = [];
	$scope.modelDef = [];
	$scope.languagesGrid = {
		data: 'models',
    columnDefs: [
    {field: 'languageCode', displayName:'Код языка'},
    {field: 'name', displayName:'Язык'},
    {field: 'flagName', displayName:'Флаг'}
    ],
    enableSorting: false
  };
  dataSvc.get("/languages", null, $("#languagesGrid")).then(function(data){
    $scope.models = data.result;
  });
  $scope.addLanguage = function(){

    modalSvc.showModal("/app/admin/languages/addLanguage.html",'languageAddModal', $scope).then(function(data){
      dataSvc.get("/languages", null, $("#languagesGrid")).then(function(data){
        $scope.models = data.result;
      });
    });

  }
  $scope.editLanguage = function(){


  }
  $scope.removeLanguage = function(){
    

  }
}


