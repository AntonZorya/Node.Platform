function leftSideMenuCtrl($scope, $rootScope, $route, $location, $timeout)
{
    var self = this;


    //$scope.menu = $rootScope.currentTopMenuItem.childs;

    
    //$rootScope.$watch("currentTopMenuItem", function () {
    //    if ($rootScope.currentTopMenuItem && $rootScope.currentTopMenuItem.active) {
    //        $scope.menu = $rootScope.currentTopMenuItem.childs;
            
    //    }
    //}, true);

    


   
    $scope.link = function(menuItem, $event)
    {
        $event.stopPropagation();
        $event.preventDefault();

        if ($rootScope.currentLeftMenuItem) {
            $rootScope.currentLeftMenuItem.active = false;
        }
        if (menuItem.loadFirstChild && menuItem.childs && menuItem.childs.length > 0)
        {
            $rootScope.currentLeftMenuItem = menuItem.childs[0];
        }
        else
        {
            $rootScope.currentLeftMenuItem = menuItem;
        }


        $rootScope.currentLeftMenuItem.active = true;

        $location.path($rootScope.currentLeftMenuItem.url);

        //var prevCurItem = _.find($scope.menu, function (item) {
        //    return item.active;
        //});
        //if (prevCurItem) {
        //    prevCurItem.active = false;
        //    self.unsetChildsActive(prevCurItem);
        //}
        //if (menuItem.loadFirstChild && menuItem.childs && menuItem.childs.length > 0) {
        //    menuItem.childs[0].active = true;
        //    $location.path(menuItem.childs[0].url);
        //}
        //else {
        //    menuItem.active = true;
        //    $location.path(menuItem.url);
        //}
    }


    //this.unsetChildsActive = function(item)
    //{
    //    _.each(item.childs, function (child) {
    //        if (child.active === true)
    //            child.active = false;
    //        self.unsetChildsActive(child);
    //    });
    //}

}


arndApplication.controller("leftSideMenuCtrl", ["$scope", "$rootScope", "$route", "$location", "$timeout", leftSideMenuCtrl]);