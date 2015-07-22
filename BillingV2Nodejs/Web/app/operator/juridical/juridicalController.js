billingApplication.controller('juridicalController', ['$scope', 'dataService', 'toastr', juridicalController]);

function juridicalController($scope, dataService, toastr) {

    $scope.searchTerm = '';

    $scope.data = [];

    $scope.search = function () {
        dataService.get('/clientJur/search', {searchTerm: $scope.searchTerm}, null).then(function (response) {
            $scope.data = response.result;
        });
    };

    $scope.showCounters = function (item) {
        item.isShowCounters = !item.isShowCounters;
    };

    $scope.updateCounter = function (clientId, counter) {
        counter.dateOfCurrentCounts = new Date();

        dataService.post('/client/updateClientCounter', {
            clientId: clientId,
            counter: counter
        }).then(function (response) {
            toastr.success('', 'Значение успешно изменено');
            console.log(response.result);
        });
    };

}


