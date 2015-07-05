function facilitiesCtrl($scope, dataSvc, $location, $timeout, addData, $rootScope)
{
    var self = this;

    this.container = $("#facilitiesContainer");
    
    $scope.data = [];
    $scope.types = [];
    $scope.organizations = [];

    $scope.organizationId = null;
    $scope.type = null;
    $scope.term = "";
    this.typesUploaded = false;
    this.orgUploaded = false;

    dataSvc.get("/facility/facilitytype/getall", {}, self.container).then(function (res) {
        if (res.operationResult === 0)
        {
            $scope.types = res.result;
            if (addData.facilityType != null)
            {
                $scope.type = _.find($scope.types, function(typ) {  return typ._id === addData.facilityType._id });
            }
            else
            {
                $scope.type = $scope.types[0];
            }
            self.typesUploaded = true;
        }
    });

    $scope.getData = function()
    {
        dataSvc.get("/facilities", { organizationId: $scope.organizationId, facilityTypeId: $scope.type._id, term: $scope.term }, self.container).then(function (res) {
            if (res.operationResult === 0)
                $scope.data = res.result;
        });
    }

    $scope.$watch(function() {
        $rootScope.user
    }, function() {
        if ($rootScope.user)
        {
            self.orgUploaded = true;
            $scope.organizationId = $rootScope.user.organizationId;
        }
    });


    var initTerm = true;
    $scope.$watch("term", function () {
        if (initTerm)
            initTerm = false;
        else if (self.typesUploaded && self.orgUploaded)
            $scope.getData();
    }, true);

    var initType = true;
    $scope.$watch("type", function () {
        if (initType)
            initType = false;
        else if (self.typesUploaded && self.orgUploaded)
            $scope.getData();
    }, true);

    var initOrg = true;
    $scope.$watch("organizationId", function() {
        if (initOrg)
            initOrg = false;
        else if(self.typesUploaded && self.orgUploaded)
            $scope.getData();
    });


    $scope.add = function()
    {
        addData.facilityType = $scope.type;
        addData.organizationId = $scope.organizationId;
        $location.path("/facilities/add");
    }

    $scope.update = function (facility) {
        $location.path("/facilities/update" + facility._id);
    }

    $scope.delete = function (facility) {

    }

    $timeout(function() {
        if (self.typesUploaded && self.orgUploaded)
            $scope.getData();
    });

}


arndApplication.factory('addFacilityData', [function(){
    return {
        facilityType: null,
        organizationId: ''
    };
}]);

arndApplication.controller("facilitiesCtrl", ["$scope", "dataService", "$location", "$timeout", 'addFacilityData', '$rootScope', facilitiesCtrl]);