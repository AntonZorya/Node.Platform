function addFacilityTypeCtrl($scope, dataSvc, validationSvc, $location) {

    validationSvc.init($scope);

    var self = this;


    $scope.vm = {
        name: "",
        description: ""
    }



    $scope.save = function()
    {
        dataSvc.post("/facility/facilitytype/add", $scope.vm).then(function (res) {
            if (res.operationResult === 0)
                $location.path("/facilities/facilitytypes");
        });
    }

}

arndApplication.controller("addFacilityTypeCtrl", ["$scope", "dataService", "validationSvc", "$location", addFacilityTypeCtrl]);