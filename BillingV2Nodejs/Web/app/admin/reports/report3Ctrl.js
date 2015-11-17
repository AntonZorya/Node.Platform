/**
 * Created by vaio on 06.10.2015.
 */
billingApplication.controller('report3Ctrl', ['dataService', '$scope','validationSvc', report3Ctrl]);

function report3Ctrl(dataSvc, $scope, valSvc) {

    $scope.status = "";
    $scope.dots = ".";

    $scope.refreshOdata = function(){

        dataSvc.get("/test2", {}, $("#container")).then(function(res) {
            if(res.result){
                $scope.status = "Обновление канала ODATA запущено, пожалуйса подождите!";
            }
            else{
                $scope.status = "Обновление канала ODATA было запущено другим пользователем, пожалуйса подождите!";
            }
            setTimeout($scope.checkOdataStatus(), 1000);

        });
    }

    $scope.checkOdataStatus = function(){
        dataSvc.get("/test2/status", {}, $("#container")).then(function(res) {
            if(res.result){
                $scope.status+=$scope.dots;
                setTimeout(function(){$scope.checkOdataStatus();}, 10000);
            }
            else{
                $scope.status = "Обновление завершено!!!";
            }

        });
    }

}