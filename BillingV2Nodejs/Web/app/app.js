var billingApplication = angular.module('billingApplication', ['indexedDB', "highcharts-ng", 'commonModule', 'ngRoute', 'i18nModule', 'ngCookies', 'angularify.semantic.checkbox', 'ui.grid', 'ngAnimate', 'toastr', 'ui.date', 'angularify.semantic.dropdown', 'angularify.semantic.modal'])
    .config(['$routeProvider', function (routeProvider) {
        routeProvider
            .otherwise({
                redirectTo: '/main'
            })
            .when("/main", {
                templateUrl: "./app/admin/main/mainView.html"
            })
            .when("/administration/translate", {
                templateUrl: "./app/admin/translate/translateView.html"
            })
            .when("/administration/languages", {
                templateUrl: "./app/admin/languages/languagesView.html"
            })
            .when("/administration/users", {
                templateUrl: "./app/admin/users/users.html"
            })
            .when("/admin/users/add", {
                templateUrl: "./app/admin/users/addUser.html"
            })
            .when("/admin/users/update", {
                templateUrl: "./app/admin/users/updateUser.html"
            })
            .when("/reports/report1", {
                templateUrl: "./app/admin/reports/report1View.html"
            })
            .when("/reports/report2", {
                templateUrl: "./app/admin/reports/report2View.html"
            })
            .when("/reports/report3", {
                templateUrl: "./app/admin/reports/report3View.html"
            })

            .when("/login", {
                templateUrl: "./app/login/login.html"
            })
            .when("/loginNormal", {
                templateUrl: "./app/login/loginNormal.html"
            })
            .when("/controller/main", {
                templateUrl: "./app/controller/main.html"
            })
            .when("/controller/sub:id", {
                templateUrl: "./app/controller/sub.html"
            })
            .when('/operator/juridical', {
                templateUrl: './app/operator/juridical/juridicalView.html'
            })
            .when('/operator/juridical/history', {
                templateUrl: './app/operator/juridical/juridicalHistoryView.html'
            })
            .when('/operator/juridical/paymentsByPeriod', {
                templateUrl: './app/operator/juridical/paymentsByPeriodView.html'
            })
            .when('/operator/fizical', {
                templateUrl: './app/operator/fizical/fizicalView.html'
            })
            .when('/operator/fizical/paymentsByPeriod', {
                templateUrl: './app/operator/fizical/paymentsByPeriodView.html'
            })
            .when('/address', {
                templateUrl: "./app/admin/addresses/addressesView.html"
            })
            .when('/test', {
                templateUrl: "./app/admin/test/testView.html"
            })
            .when('/dictionary', {
                templateUrl: "./app/admin/dictionary/dictionaryView.html"
            })
            .when('/dictionary/clienttypes', {
                templateUrl: "./app/admin/test/testView.html"
            })
            .when('/dictionary/controllers', {
                templateUrl: "./app/admin/test/testView.html"
            })
            .when('/dictionary/tariffs', {
                templateUrl: "./app/admin/test/testView.html"
            })
        ;
    }]).config(['$translatePartialLoaderProvider', function (translatePartialLoader) {
        translatePartialLoader.addPart('identity');
    }]).config(function ($indexedDBProvider) {
        $indexedDBProvider
            .connection('myObjectStore')
            .upgradeDatabase(1, function (event, db, tx) {
                var userStore = db.createObjectStore('user', {keyPath: '_id'});

                var objStore = db.createObjectStore('objects', {keyPath: '_id'});
                objStore.createIndex('name_idx', 'name', {unique: false});
                objStore.createIndex('bin_idx', 'bin', {unique: false});
                objStore.createIndex('address_idx', 'address', {unique: false});
            }).upgradeDatabase(2, function (event, db, tx) {
                db.deleteObjectStore("objects");
                var objStore = db.createObjectStore('objects', {keyPath: '_id'});
                objStore.createIndex('name_idx', 'name', {unique: false});
                objStore.createIndex('bin_idx', 'bin', {unique: false});
                objStore.createIndex('address_idx', 'address', {unique: false});
            });
    });
