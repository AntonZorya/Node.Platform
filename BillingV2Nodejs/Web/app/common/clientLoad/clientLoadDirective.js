/**
 * Created by vaio on 13.10.2015.
 */
billingApplication.directive('clientLoad', ['dataService', clientLoad]);
billingApplication.filter("clientLoadsFilterByGroup", function () {
    return function (array, group, negotiableLoadList) {
        return array.filter(function (item) {
            if (_.isObject(item.negotiableLoad)) {
                if (item.negotiableLoad.groupNumber == group) return true;
                else return false;
            }
            else if (_.isString(item.negotiableLoad)) {
                return _.some(negotiableLoadList, function (elem) {
                    if (elem._id == item.negotiableLoad && elem.groupNumber == group) {
                        return true;
                    }
                    else{
                        return false;
                    }
                });

            }
        });
    }
});
billingApplication.filter("exclusiveNegotiableLoadsFilterByGroup", function () {
    return function (array, expression, group, negotiableLoad, equal) {

        var filtered = array.filter(function(item){
            return !_.some(expression, function(elem){
                if(elem.negotiableLoad == negotiableLoad) return false;
                return elem.negotiableLoad == item._id;
            });
        });
        return filtered.filter(function(item){
            if(equal==false) {
                return item.groupNumber != group;
            }
            else{
                return item.groupNumber == group;
            }


        });
    }
});

function clientLoad(dataSvc) {

    return {
        restrict: 'E',
        templateUrl: '/app/common/clientLoad/clientLoadDirectiveTmp.html',
        scope: {
            clientloads: "="
        },
        link: function (scope, elm, attrs) {
            scope.parent = scope.$parent;

            scope.negotiableLoadList = [];
            scope.extraLoadsVar = false;
            scope.addAvailable = true;

            scope.init = function () {
                if (!scope.clientloads || !(scope.clientloads instanceof Array)) {
                    scope.clientloads = [];
                }
                if (scope.clientloads && scope.clientloads.length == 0) {
                    //create new
                    var proto = {
                        negotiableLoad: "",
                        quantity: 1,
                        waterPercent: 100,
                        canalPercent: 100
                    };
                    scope.clientloads.push(proto);
                    var load = _.find(scope.negotiableLoadList, function(item){
                        return item.groupNumber==1;
                    });
                    if(load)
                        scope.clientloads[0].negotiableLoad = load._id;

                }
                else if (scope.clientloads && scope.clientloads.length > 0) {
                    //todo implement update
                    _.each(scope.clientloads, function(item, index){
                        if(item.negotiableLoad && item.negotiableLoad._id){
                            var check = _.some(scope.negotiableLoadList, function(elem){
                                if(elem._id == item.negotiableLoad._id) return true;
                                return false;
                            });
                            if(item.negotiableLoad.groupNumber && item.negotiableLoad.groupNumber!=1 && check){
                                scope.extraLoadsVar = true;
                            }
                            if (check) item.negotiableLoad = item.negotiableLoad._id;
                        }
                    });

                }
            };

            scope.getNegotiableLoadList = function () {
                dataSvc.get("/loadings/negotiableLoad/getAllOrGroup", null, $("#form")).then(function (res) {
                    if (res.operationResult == 0 && res.result.length > 0) {
                        scope.negotiableLoadList = res.result;
                        scope.init();
                    }
                });
            };

            scope.getNegotiableLoadList();

            scope.getLoadUnitName = function (id) {
                if (_.isObject(id)) {
                    //todo id can be object
                    if (id.loadUnit && id.loadUnit.name) {
                        return id.loadUnit.name;
                    }
                    else return "_ошибка";
                }
                else if (_.isString(id)) {
                    if (scope.negotiableLoadList && scope.negotiableLoadList.length > 0) {
                        var res = _.find(scope.negotiableLoadList, function (num) {
                            return num._id == id;
                        });
                        if(res && res.loadUnit_name) return res.loadUnit_name;
                        return "_ошибка";
                    }
                    else return "_ошибка";
                }
                else {
                    return "_ошибка";
                }
            };

            scope.getLitersPerDay = function (id) {
                if (_.isObject(id)) {
                    //todo id can be object
                    if (id.litersPerDay) {
                        return id.litersPerDay;
                    }
                    else return "_ошибка";
                }
                else if (_.isString(id)) {
                    if (scope.negotiableLoadList && scope.negotiableLoadList.length > 0) {
                        var res = _.find(scope.negotiableLoadList, function (num) {
                            return num._id == id;
                        });
                        if(res && res.litersPerDay) return res.litersPerDay;
                        return "_ошибка";
                    }
                }
                else {
                    return "_ошибка";
                }
            };

            scope.extraLoadsSwitcher = function () {
                if (scope.clientloads && scope.clientloads.length > 0) {
                    if (!scope.extraLoadsVar) {
                        var loadListFiltered = scope.negotiableLoadList.filter(function (item1) {
                            return !_.some(scope.clientloads, function (item2) {
                                return item2.negotiableLoad == item1._id;
                            });
                        });

                        loadListFiltered = loadListFiltered.filter(function (item) {
                            return !item.groupNumber || item.groupNumber != 1;
                        });

                        if(loadListFiltered && loadListFiltered.length>0){
                            var proto = {
                                negotiableLoad: "",
                                quantity: 1,
                                waterPercent: 100,
                                canalPercent: 100
                            };
                            scope.clientloads.push(proto);
                            scope.clientloads[scope.clientloads.length-1].negotiableLoad = loadListFiltered[0]._id;
                        }
                    }
                    else {

                        for(var i = 0; i < scope.clientloads.length; i++) {
                            var item = scope.clientloads[i];
                            var check = _.some(scope.negotiableLoadList, function(elem){
                                if(elem._id==item.negotiableLoad && elem.groupNumber != 1) return true;
                                else return false;
                            });
                            if(check) {
                                scope.clientloads.splice(i, 1);
                                i--;
                            }
                        }

                    }
                    scope.addAvailable = true;
                }
            };

            scope.addExtraLoads = function () {
                var loadListFiltered = scope.negotiableLoadList.filter(function (item1) {
                    return !_.some(scope.clientloads, function (item2) {
                        return item2.negotiableLoad == item1._id;
                    });
                });

                loadListFiltered = loadListFiltered.filter(function (item) {
                    return !item.groupNumber || item.groupNumber != 1;
                });

                if (loadListFiltered && loadListFiltered.length > 0) {
                    var proto = {
                        negotiableLoad: "",
                        quantity: 1,
                        waterPercent: 100,
                        canalPercent: 100
                    };
                    scope.clientloads.push(proto);
                    scope.clientloads[scope.clientloads.length - 1].negotiableLoad = loadListFiltered[0]._id;
                }
                else {
                    scope.addAvailable = false;
                }

            };

            scope.removeExtraLoad = function (clientload) {

                _.each(scope.clientloads, function(item, index, list){
                    if(item==clientload){
                        scope.clientloads.splice(index, 1);
                    }
                });
                scope.addAvailable = true;
            };

        }
    };
}