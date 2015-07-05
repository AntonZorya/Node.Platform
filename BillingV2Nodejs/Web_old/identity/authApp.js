/// <reference path="../../typings/angularjs/angular.d.ts"/>
var arndApplication = angular.module('arndApplication', ['commonModule','i18nModule','ngRoute', 'ngCookies', 'angularify.semantic.checkbox', 'angularify.semantic.dropdown']).config(['$routeProvider', function (routeProvider) {
    routeProvider
           .when("/login", {
               templateUrl: "login.html"
           }).otherwise({
               redirectTo: '/login'
           }).when("/register", {
               templateUrl: "register.html"
           });
}]).config(['$translatePartialLoaderProvider', function (translatePartialLoader) {
    translatePartialLoader.addPart('identity');
}])