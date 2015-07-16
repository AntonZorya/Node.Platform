/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('mainController', ['$window','$rootScope','dataService', '$scope', '$cookieStore','validationSvc', '$location', '$indexedDB', 'modalSvc', mainController]);

function mainController($window, $rootScope, dataSvc, $scope, $cookie, valSvc, $location, $indexedDB, modalSvc) {




    $indexedDB.openStore('user',function(store) {
        store.count().then(function(count) {
            if(count < 1){
                $window.location = "/#/login";
            }
        });
    });

    $indexedDB.openStore('user',function(store) {
        store.getAll().then(function (obj) {
            if(obj[0]) {
                $scope.controllerName = obj[0].fullName;
            }
        });

    });

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
                            {
                                if(_.all(cursor.value.counters, function(item){
                                        return (item.currentCounts>item.lastCounts || item.hasProblems);
                                    })){
                                    cursor.value.color="#F6FFED";
                                    cursor.value.state = 1;
                                } else if(
                                    _.any(cursor.value.counters, function(item){
                                        return (item.currentCounts>item.lastCounts || item.hasProblems);
                                    })){
                                    cursor.value.color=' #fff7f4';
                                    cursor.value.state = 2;
                                } else {
                                    cursor.value.color="white";
                                    cursor.value.state = 3;
                                }


                                if(cursor.value.uploaded){
                                    cursor.value.color='#E6F5E6';
                                    cursor.value.state = 0;
                                }

                                _.each(cursor.value.counters, function(item){
                                    if(item.currentCounts>item.lastCounts || item.hasProblems)
                                    {
                                        item.color="#F6FFED";
                                    } else{
                                        item.color="#fff7f4";
                                    }
                                });

                                result.push(cursor.value);
                            }
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
    } else{
        $scope.term = "";
        $scope.search();
    }


    $scope.sync = function(){
        var result = [];
        $indexedDB.openStore('objects',function(store) {
            var storeDb = store.transaction.transaction.objectStore("objects");
            var request = storeDb.openCursor();
            request.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {

                    if(!cursor.value.uploaded)
                        if(_.all(cursor.value.counters, function(item){
                                return ((item.currentCounts>item.lastCounts || item.hasProblems));
                            })){

                            result.push(cursor.value);

                        }



                    cursor.continue();
                } else{
                    alert("На отправку " + result.length);
                    if(result.length>0){
                    dataSvc.post("/syncClients", {clients:result}, $("#loginForm"), $scope).then(function(){
                        _.each(result, function(item){
                            item.uploaded = true;
                            $indexedDB.openStore('objects',function(store) {
                                store.upsert(item).then(function (obj) {

                                });
                            });
                        });

                        alert("Отправлено "+result.length+" записей");

                        $scope.search();
                    });
                    }


                }
            };
        });
    }



    $scope.exit = function(){
        modalSvc.yesNoModal("bomb", "#ExitSystemQuestion", "#DataWillbeLotMessage", "#No", "#Yes", $scope).then(function(data){
            if(data)
            {
                $indexedDB.openStore('user',function(store) {
                    store.clear().then(function () {
                    });
                });

                $indexedDB.openStore('objects',function(store) {

                    store.clear().then(function () {

                        window.location =  "/#/login";

                    });
                });


            }
        });
    }



    $scope.search();


        //store.getAll().then(function(obj) {
        //
        //    $scope.foundObjects = obj;
        //});



}