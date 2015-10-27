/**
 * Created by Alibek on 06.10.2015.
 */
billingApplication.controller('addFizClientController', ['$scope', 'dataService', 'modalSvc', 'toastr', 'validationSvc', addFizClientController]);

function addFizClientController($scope, dataService, modalSvc, toastr, valSvc) {
    var self = this;
    this.container = $("#addFizClientContainer");
    valSvc.init($scope);


    $scope.modalItem = {
        period: $scope.$parent.period.value,
        norm: 0,
        waterPercent: 100,
        kanalPercent: 100,
        pipelines: [{
            number: 1,
            waterPercent: 100,
            kanalPercent: 100,
            counters: [],
            fields: []
        }]
    };

    $scope.save = function () {
        $scope.commonErrors = [];
        if (!$scope.modalItem.addressId) {
            $scope.commonErrors.push('Выберите адрес');
        }
        else {
            dataService.post('/clientFiz/add', $scope.modalItem, self.container, $scope).then(function (response) {
                toastr.success('', 'Данные успешно сохранены');
                modalSvc.closeModal('addFizClientModal');
                $scope.$parent.search();
            });
        }
    };

    $scope.cancel = function () {
        modalSvc.closeModal('addFizClientModal');
    };

    $scope.close = function () {

    };

    $scope.addNewCounter = function (pipelineIndex) {

        var foundActiveCounter = _($scope.modalItem.pipelines[pipelineIndex].counters).find(function (counter) {
            return counter.isActive === true;
        });

        if (foundActiveCounter) {
            toastr.warning('Необходимо снять старый счетчик и добавить новый', 'Предупреждение')
        } else {
            var newCounter = {
                lastCounts: 0,
                isActive: true,
                isCounterNew: true,
                currentCounts: 0,
                installDate: new Date()
            };
            $scope.modalItem.pipelines[pipelineIndex].counters.push(newCounter);
        }
    };

    $scope.disableCounter = function (pipelineIndex, counterIndex) {

        if ($scope.modalItem.pipelines[pipelineIndex].avg == null ||
            $scope.modalItem.pipelines[pipelineIndex].avg == "") {

            toastr.warning('"Среднее" должно быть заполнено');

        } else {
            if (confirm('Вы действительно хотите снять счетчик?')) {

                //TODO: после тестирования раскометировать проверку дат
                /*var day1 = (new Date($scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].dateOfCurrentCounts)).getDate();
                 var day2 = new Date().getDate();

                 if (day1 === day2) {*/
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isActive = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].isCounterNew = false;
                $scope.modalItem.pipelines[pipelineIndex].counters[counterIndex].removeDate = new Date();
                /*} */
                /*else {
                 toastr.error('Чтобы снять счетчик, необходимо внести показания на сегодшний день!');
                 }*/

            }
        }


    };
}
