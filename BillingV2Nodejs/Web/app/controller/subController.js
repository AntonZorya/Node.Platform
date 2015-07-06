/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('subController', ['$window', '$route','dataService', '$scope', '$cookieStore','validationSvc', '$location', '$indexedDB', subController]);

function subController($window, $route, dataSvc, $scope,$cookie, valSvc, $location, $indexedDB) {

        $scope.goback = function(){
            $window.history.back();
        }

    $indexedDB.openStore('objects',function(store) {
        store.find($route.current.params.id).then(function (obj) {
            $scope.currentObject = obj;
        });
    });


    $scope.saveData = function(){

        if(_.all($scope.currentObject.counters, function(item){
             return (item.currentCounts<item.lastCounts || item.hasProblems)
        })){
            alert("#Текщие показания не должны быть меньше предыдущих");
            return;
        }

        _.each($scope.currentObject.counters, function(item){
            if (item.currentCounts>item.lastCounts || item.hasProblems)
            {
                if(!item.dateOfCurrentCounts)
                item.dateOfCurrentCounts = new Date();
            }
        })

        $indexedDB.openStore('objects',function(store) {
            store.upsert($scope.currentObject).then(function (obj) {
                $scope.goback();
            });
        });
    }


}
