billingApplication.controller('addressesCtrl', ['dataService', '$scope', 'validationSvc', 'modalSvc', addressesCtrl]);

function addressesCtrl(dataSvc, $scope, valSvc, modalSvc) {
    $scope.header = "#constructAddress";
    $scope.addressTypeItems = [];
    $scope.addressItems = [];
    $scope.selectedAddressTypes = [];
    $scope.selectedAddresses = [];
    $scope.mustSelectedAddressTypes = [];
    $scope.mustSelectedAddresses = [];
    $scope.addressTextRepresentation = "";


    $scope.getAddressTypeAtIndex = function (index) {
        dataSvc.get("/addressType/getChildList", {
            id: $scope.selectedAddressTypes[index]
        }, $("#form")).then(function (res) {

            if (typeof res.result !== 'undefined' && res.result.length > 0) {
                $scope.addressTypeItems = $scope.addressTypeItems.slice(0, index+1);
                $scope.selectedAddressTypes = $scope.selectedAddressTypes.slice(0, index+1);
                $scope.addressItems = $scope.addressItems.slice(0, index+1);
                $scope.selectedAddresses = $scope.selectedAddresses.slice(0, index+1);
                $scope.addressTypeItems.push(res.result);

                if($scope.mustSelectedAddressTypes[index]){

                    var temp;
                    if($scope.selectedAddressTypes[index]){
                        temp = _.find($scope.addressTypeItems[index+1], function(item){
                            return item._id==$scope.mustSelectedAddressTypes[index+1]._id
                        });
                    }
                    else{
                        temp = _.find($scope.addressTypeItems[index], function(item){
                            return item._id==$scope.mustSelectedAddressTypes[index]._id
                        });
                    }


                    if($scope.selectedAddressTypes[index]){
                        $scope.selectedAddressTypes[index+1] = temp._id;
                        $scope.getAddressAtIndex(index+1);
                    }
                    else{
                        $scope.selectedAddressTypes[index] = temp._id;
                        $scope.getAddressAtIndex(index);
                    }

                }

            }
            $scope.refreshTextRepresentation();
        });
    };

    $scope.getAddressAtIndex = function (index) {
        dataSvc.get("/address/getChildList", {
            parentId: (index == 0 ? $scope.selectedAddresses[index] : $scope.selectedAddresses[index - 1]),
            typeId: $scope.selectedAddressTypes[index]
        }, $("#form")).then(function (res) {

            $scope.addressTypeItems = $scope.addressTypeItems.slice(0, index+1);
            $scope.selectedAddressTypes = $scope.selectedAddressTypes.slice(0, index+1);
            $scope.addressItems = $scope.addressItems.slice(0, index);
            $scope.selectedAddresses = $scope.selectedAddresses.slice(0, index);
            $scope.addressItems.push(res.result);

            if($scope.mustSelectedAddresses[index]){

                var temp = _.find($scope.addressItems[index], function(item){
                    return item._id==$scope.mustSelectedAddresses[index]._id
                });
                $scope.selectedAddresses[index] = temp._id;
                if(index==$scope.mustSelectedAddresses.length-1){
                    $scope.mustSelectedAddressTypes = [];
                    $scope.mustSelectedAddresses = [];
                }
                $scope.getAddressTypeAtIndex(index);
            }
            $scope.refreshTextRepresentation();
        });
    };

    $scope.getAllParents = function(id){
        dataSvc.get("/address/collectAllParents", {id:id}, $("#form")).then(function(res){
            $scope.mustSelectedAddressTypes = res.result.addressTypes;
            $scope.mustSelectedAddresses = res.result.addresses;
            $scope.getAddressTypeAtIndex(0);
        });
    };

    $scope.refreshTextRepresentation = function(){
        $scope.addressTextRepresentation = "";
        _.each($scope.addressTypeItems, function(item, index){
            var temp = _.find($scope.addressTypeItems[index], function(i){
                return i._id==$scope.selectedAddressTypes[index];
            });
            var temp2 = _.find($scope.addressItems[index], function(i){
                return i._id==$scope.selectedAddresses[index];
            });
            if(index!=0)
                $scope.addressTextRepresentation += ", ";
            $scope.addressTextRepresentation += (temp && temp.shortName ? temp.shortName : "");
            $scope.addressTextRepresentation += " ";
            $scope.addressTextRepresentation += (temp2 && temp2.name ? temp2.name : "");

        });
    };

    $scope.clickOk = function(){
        modalSvc.elementScope.id = $scope.selectedAddresses[$scope.selectedAddresses.length-1];
        modalSvc.closeModal("addressesModal");
        // fill parent scope

    };

    $scope.clickCancel = function(){
        modalSvc.resolveModal("addressesModal");
    };

    if(modalSvc.elementScope.id){
        $scope.getAllParents(modalSvc.elementScope.id);
    }
    else{
        $scope.getAddressTypeAtIndex(0);
    }
}