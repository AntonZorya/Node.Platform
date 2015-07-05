function facilityTypesCtrl($scope, dataSvc, validationSvc, $location) {
    var self = this;




    $scope.models = [];


   


    $scope.getData = function () {
        dataSvc.get("/facility/facilitytype/getall", {}).then(function (res) {
            $scope.models = res.result;
        });
    }

    $scope.getData();

    $scope.add = function () {
        $location.path("/facilities/facilitytypes/add");
    }

    $scope.update = function (ft) {
        if (ft._id)
        {
            $location.path("/facilities/facilitytypes/update:"+ft._id);
        }
    }

    $scope.delete = function (ft) {
        $('.basic.test.modal').modal({
            closable: false,
            onDeny: function () {
            },
            onApprove: function () {
                dataSvc.delete("/facility/facilitytype/delete", ft._id).then(function (res) {
                    $scope.getData();
                });
            }
        })
      .modal('show');
    }
}

arndApplication.controller("facilityTypesCtrl", ["$scope", "dataService", "validationSvc", "$location", facilityTypesCtrl])