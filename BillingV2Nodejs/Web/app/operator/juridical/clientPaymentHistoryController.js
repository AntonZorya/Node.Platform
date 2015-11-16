billingApplication.controller('clientPaymentHistoryController', ['$scope', 'dataService', 'modalSvc', 'toastr','$rootScope', clientPaymentHistoryController]);

function clientPaymentHistoryController($scope, dataService, modalSvc, toastr,$rootScope) {

    var selectedItem = $scope.$parent.selectedItem;
    var id = selectedItem._id;
    var period = $scope.$parent.period;



    $scope.modalItem = {};
    $scope.modalItem.clientBalanceDetails = [];
    $scope.getByPeriodAndClientIdWithDetails = function () {

        dataService.get('/balance/getByPeriodAndClientIdWithDetails', {
            clientId: id,
            period: period
        }).then(function (response) {
            $scope.modalItem.clientBalanceDetails = response.result;
        });
    };
    $scope.getByPeriodAndClientIdWithDetails();



    $scope.editForfeitJurClient = function (data) {
        //var x=0;
        console.log(data);
        console.log(data.balanceId.sum);
        console.log(data.comment);
        $scope.forfeitDetailsId=data._id;
        console.log("IDw= ",$scope.forfeitDetailsId);
        $scope.forfeitBalanceId=data.balanceId._id;

        $scope.forfeitDetailssum=data.balanceId.sum;
        $scope.forfeitDetailsComm=data.comment;

        modalSvc.showModal('/app/operator/juridical/editForfeitJurClient.html', 'editForfeitJurClientModal', $scope);
    };

    $scope.body = {
        forfeitDetails: {
            _id:$scope.forfeitDetailsId,
            //sum:$scope.forfeitDetailssum,
            //comment:$scope.forfeitDetailsComm,
            balanceId:$scope.forfeitBalanceId,
            clientId: id,
            period: period
        },
        user: $rootScope.user
    };


    console.log($scope.body.forfeitDetails.clientId);




    $scope.modalItem = _.extend($scope.modalItem, $scope.$parent.selectedItem);

    $scope.forfeitDetailsDelete=function(data,event){
        console.log(data);
        var body = {
            _id: data._id,
            balanceId: data.balanceId
        };
        dataService.post('/forfeitDetails/delete', body).then(function (response) {

            $scope.$parent.getBalanceForClient(id);
            $scope.$parent.getAllBalance();

            console.log(response.result);
            toastr.success('', 'Данные успешно сохранены');
            modalSvc.closeModal('clientPaymentHistoryModal');
            modalSvc.showModal('/app/operator/juridical/clientPaymentHistory.html', 'clientPaymentHistoryModal', $scope);
        });
    }
    /* $scope.getClientPayments = function () {
     dataService.get('/paymentsByClientId', {clientId: id}).then(function (response) {
     $scope.clientPayments = response.result;
     console.log(response.result);
     });
     };
     $scope.getClientPayments();*/
}