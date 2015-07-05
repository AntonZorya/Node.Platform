function updateFacilityTypeCtrl($scope, dataSvc, validationSvc, $location, $route) {

    validationSvc.init($scope);

    var self = this;


    $scope.vm = {
        name: "",
        description: ""
    }

    dataSvc.get("/facility/facilitytype/get", { id: $route.current.params.id }).then(function (res) {
        if (res.operationResult === 0)
            $scope.vm = res.result;
    });



    $scope.save = function () {
        dataSvc.post("/facility/facilitytype/update", $scope.vm).then(function (res) {
            if (res.operationResult === 0)
                $location.path("/facilities/facilitytypes");
        });
    }

   

}

arndApplication.controller("updateFacilityTypeCtrl", ["$scope", "dataService", "validationSvc", "$location", "$route", updateFacilityTypeCtrl]);