/// <reference path="../../typings/angularjs/angular.d.ts"/>
var arndApplication = angular.module('arndApplication', ["highcharts-ng",'commonModule','ngRoute','i18nModule','ngCookies', 'angularify.semantic.checkbox', 'ui.grid']).config(['$routeProvider', function (routeProvider) {
    routeProvider
          //.otherwise({
          //     redirectTo: '/main'
          // })
            .when("/main", {
               templateUrl: "./app/main/main.html"
           }).when("/admin", {
               templateUrl: "app/admin/admin.html"
           }).when("/admin/translate", {
               templateUrl: "app/admin/translate/translate.html"
           }).when("/admin/languages", {
            templateUrl: "app/admin/languages/languages.html"
           }).when("/facilities", {
               templateUrl: "app/facilities/facilities.html"
           }).when("/facilities/all", {
               templateUrl: "app/facilities/facilities.html"
           }).when("/facilities/facilitytypes", {
               templateUrl: "app/facilities/facilitytypes/facilitytypes.html"
           }).when("/facilities/facilitytypes/add", {
               templateUrl: "app/facilities/facilitytypes/addFacilitytype.html"
           }).when("/facilities/facilitytypes/update:id", {
               templateUrl: "app/facilities/facilitytypes/updateFacilitytype.html"
           }).when("/arendators", {
               templateUrl: "app/arendators/arendators.html"
           }).when("/arendators/fiz/add", {
               templateUrl: "app/arendators/addArendatorFiz.html"
           }).when("/arendators/fiz/update:id", {
               templateUrl: "app/arendators/updateArendatorFiz.html"
           }).when("/arendators/jur/add", {
               templateUrl: "app/arendators/addArendatorJur.html"
           }).when("/arendators/jur/update:id", {
               templateUrl: "app/arendators/updateArendatorJur.html"
           }).when("/facilities", {
              templateUrl: "app/facilities/facilities.html"
           }).when("/facilities/add", {
              templateUrl: "app/facilities/addFacility.html"
           }).when("/facilities/update:id", {
              templateUrl: "app/facilities/updateFacility.html"
           }).when("/admin/users", {
              templateUrl: "app/admin/users/users.html"
           }).when("/admin/users/add", {
              templateUrl: "app/admin/users/addUser.html"
           }).when("/admin/users/update:id", {
              templateUrl: "app/admin/users/updateUser.html"
           })

    ;
}]).config(['$translatePartialLoaderProvider', function (translatePartialLoader) {
    translatePartialLoader.addPart('identity');
}]);