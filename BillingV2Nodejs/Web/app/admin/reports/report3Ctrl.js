/**
 * Created by vaio on 06.10.2015.
 */
billingApplication.controller('report3Ctrl', ['dataService', '$scope','validationSvc', report3Ctrl]);

function report3Ctrl(dataSvc, $scope, valSvc) {

    $scope.status = "";

    $scope.refreshOdata = function(){
        $scope.status = "Идет обновление данных для канала ODATA";
        dataSvc.get("/test2", {}, $("#container")).then(function(res) {
            $scope.status = "Обновление завершено";
        });
    }

}