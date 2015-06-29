/// <reference path="../../typings/angularjs/angular.d.ts"/>
var billingApplication = angular.module('billingApplication', ['indexedDB',"highcharts-ng",'commonModule','ngRoute','i18nModule','ngCookies', 'angularify.semantic.checkbox', 'ui.grid'])
    .config(['$routeProvider', function (routeProvider) {
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
           }).when("/login", {
              templateUrl: "./app/login/login.html"
        }).when("/loginNormal", {
            templateUrl: "./app/login/loginNormal.html"
        }).when("/admin/languages", {
            templateUrl: "app/admin/languages/languages.html"
        }).when("/controller/main", {
            templateUrl: "app/controller/main.html"
        }).when("/controller/sub:id", {
            templateUrl: "app/controller/sub.html"
        });
}]).config(['$translatePartialLoaderProvider', function (translatePartialLoader) {
    translatePartialLoader.addPart('identity');
}]).config(function ($indexedDBProvider) {
        $indexedDBProvider
            .connection('myObjectStore')
            .upgradeDatabase(1, function(event, db, tx){
                var userStore = db.createObjectStore('user', {keyPath: '_id'});

                var objStore = db.createObjectStore('objects', {keyPath: '_id'});
                objStore.createIndex('name_idx', 'name', {unique: false});
                objStore.createIndex('bin_idx', 'bin', {unique: false});
                objStore.createIndex('address_idx', 'address', {unique: false});
            }).upgradeDatabase(2, function(event, db, tx){
                db.deleteObjectStore("objects")
                var objStore = db.createObjectStore('objects', {keyPath: '_id'});
                objStore.createIndex('name_idx', 'name', {unique: false});
                objStore.createIndex('bin_idx', 'bin', {unique: false});
                objStore.createIndex('address_idx', 'address', {unique: false});
            });
    });