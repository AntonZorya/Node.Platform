function mainMenuCtrl($scope, dataSvc, $route, $location, $rootScope) {

    var self = this;

    $scope.menu = [];
    $scope.user = {};

    dataSvc.get("/identity/menu", {}, $("#main_page")).then(function (res) {

        $rootScope.user = res.user;
        $scope.user = res.user;
          dataSvc.get("/identity/organization", {id: res.user._id}, self.container).then(function(res) {
                $rootScope.userOrganization = res.result;
            });
        $scope.menu = res.menu;
        var curItem = _.find($scope.menu, function (item) {
            return item.url === $location.path();
        });
        if (curItem) {
            $rootScope.currentTopMenuItem = curItem;
            $rootScope.currentTopMenuItem.active = true;
        }
        else {
            _.each($scope.menu, function (item) {
                self.setChildCurrent(item, item);
            });
        }
    });

    $scope.link = function (menuItem, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        if ($rootScope.currentTopMenuItem)
            $rootScope.currentTopMenuItem.active = false;
        $rootScope.currentTopMenuItem = menuItem;
        $rootScope.currentTopMenuItem.active = true;
        if (!menuItem.loadFirstChild) {
            $location.path(menuItem.url);
        }
        else
        {
            if (menuItem.loadFirstChild === true && menuItem.childs.length > 0) {
                if ($rootScope.currentLeftMenuItem)
                    $rootScope.currentLeftMenuItem.active = false;
                $rootScope.currentLeftMenuItem = menuItem.childs[0];
                $rootScope.currentLeftMenuItem.active = true;
                $location.path($rootScope.currentLeftMenuItem.url);
            }
        }
    }

    this.setChildCurrent = function(item, top)
    {
        var cur = _.find(item.childs, function (child) {
            return child.url === $location.path();
        });
        if (cur) {
            if ($rootScope.currentTopMenuItem)
                $rootScope.currentTopMenuItem.active = false;
            $rootScope.currentTopMenuItem = top;
            $rootScope.currentTopMenuItem.active = true;
            if ($rootScope.currentLeftMenuItem)
                $rootScope.currentLeftMenuItem.active = false;
            $rootScope.currentLeftMenuItem = cur;
            $rootScope.currentLeftMenuItem.active = true;
        }
        else {
            _.each(item.childs, function (child) {
                self.setChildCurrent(child, top);
            });
        }
    }

    //this.unsetChildActive = function (item) {
    //    var act = _.find(item.childs, function (child) {
    //        return child.active;
    //    });
    //    if (act) {
    //        act.active = false;
    //        $rootScope.currentLeftMenuItem = null;
    //    }
    //    else {
    //        _.each(item.childs, function (child) {
    //            self.unsetChildActive(child);
    //        });
    //    }
    //}

}

billingApplication.controller("mainMenuCtrl", ["$scope", "dataService", "$route", "$location", "$rootScope", mainMenuCtrl]);