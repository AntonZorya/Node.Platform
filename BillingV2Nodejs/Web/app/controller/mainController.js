/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('mainController', ['$rootScope','dataService', '$scope', '$cookieStore','validationSvc', '$location', '$indexedDB', mainController]);

function mainController($rootScope, dataSvc, $scope, $cookie, valSvc, $location, $indexedDB) {





        $scope.foundObjects = [];

    $scope.toEnter = function(item){
        $location.path("/controller/sub"+item._id);
    };

        $scope.showCounters = function(item){
            item.isShowCounters = !item.isShowCounters;
        }

            $scope.search = function(){
                var result = [];
                $indexedDB.openStore('objects',function(store) {
                    var storeDb = store.transaction.transaction.objectStore("objects");
                    var request = storeDb.openCursor();
                    request.onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            if(cursor.value.name.toLowerCase().indexOf($scope.term.toLowerCase()) !== -1 ||
                                cursor.value.address.toLowerCase().indexOf($scope.term.toLowerCase()) !== -1 ||
                                cursor.value.bin.toLowerCase().indexOf($scope.term.toLowerCase()) !== -1)

                                result.push(cursor.value);
                            cursor.continue();
                        } else{
                            $rootScope.query = $scope.term;
                            $scope.foundObjects = result;
                        }
                    };
                });
            }



    if($rootScope.query)
    {
        $scope.term= $rootScope.query;
        $scope.search();
    }

        //store.getAll().then(function(obj) {
        //
        //    $scope.foundObjects = obj;
        //});



}