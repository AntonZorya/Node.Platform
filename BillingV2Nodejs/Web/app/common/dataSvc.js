
billingApplication.service('dataService', ['$http', '$q', '$location', '$window', '$cookieStore', 'API_HOST', '$indexedDB', dataService]);

function dataService($http, $q, $location, $window, $cookies, API_HOST, $indexedDB) {

    this.urlFor = function (url) {

        return API_HOST + url;
    };

    var self = this;

    this.checkForIndexedDB = function(){
        $indexedDB.openStore('user',function(store) {
           store.count().then(function(count) {
               if(count > 0){
               $window.location = "/#/controller/main";
               }
           });
        });

    };

    this.checkLogin = function (url) {


        this.checkForIndexedDB();


        var re = /(\/login)|(\/languages)|(\/register)|(\/loginNormal)/;
        if (url.match(re)) return "";
        var token = $.cookie("ArndBooksAuthToken");
            //$cookies.get('ArndBooksAuthToken');
        if (!token)
            this.toLogin();
        else
            return token;
    };

    this.toLogin = function () {
        var currentUrl = encodeURIComponent($location.absUrl());
        $window.location.href = '#/loginNormal?url=' + currentUrl;
    };


    this.get = function (url, params, loaderElem) {
        var token = this.checkLogin(url);
        var deferred = $q.defer();
        
         if (loaderElem)
            $(loaderElem).addClass("loading");
        
        $http({
            method: 'GET',
            url: this.urlFor(url),
            params: params,
            headers: {
                'Authorization': token
            },
        })
            .success(function (data) {
                 if (loaderElem)
            $(loaderElem).removeClass("loading");
            deferred.resolve(data);
        })
            .error(function (error, status) {
                     if (loaderElem)
            $(loaderElem).removeClass("loading");
            if (status == 401) {
                self.toLogin();
            } else {
                
                if (loaderElem) {
                     $(loaderElem).dimmer({closable:false, 
                     template : {
                          dimmer: function() {
                           return $('<div class="ui dimmer"><div class="content"><div class="center"><i class="huge frown icon"></i> <h3>Произошла ошибка</h3></div></div></div>').attr('class', 'ui dimmer');
                          }
                        }});
                    
                    $(loaderElem).dimmer('show');
                    
                }
                deferred.reject(error);
            
               
            }
        });

        return deferred.promise;
    };

    this.post = function (url, data, loaderElem, scope) {
        
        if(scope)
        {
            scope.validationErrors = [];
            scope.commonErrors = [];
        }
        
        var token = this.checkLogin(url);

        var deferred = $q.defer();

        if (loaderElem)
            $(loaderElem).addClass("loading");

        $http({
            method: 'POST',
            url: this.urlFor(url),
            headers: {
                'Authorization': token
            },
            data: data
        }).success(function (data) {
            if (loaderElem)
                $(loaderElem).removeClass("loading");

            deferred.resolve(data);
        }).error(function (error, status) {
            if (loaderElem)
                    $(loaderElem).removeClass("loading");
           if(status == 400){
               if (scope) {
                   if(error.operationResult==2){
                       scope.validationErrors = error.result[0].errors;
                   }
                   if(error.operationResult==3){
                       scope.commonErrors = error.result;
                   }
               }
           }
           
            if (status == 401) {
               self.toLogin();
            }
            
            if(status == 500)
                {
                if (loaderElem) {
                     $(loaderElem).dimmer({closable:false, 
                     template : {
                          dimmer: function() {
                           return $('<div class="ui dimmer"><div class="content"><div class="center"><i class="huge frown icon"></i> <h3>Произошла ошибка</h3></div></div></div>').attr('class', 'ui dimmer');
                          }
                        }});
                    
                    $(loaderElem).dimmer('show');
                    
                }
                deferred.reject(error);
            }
        });

        return deferred.promise;
    };
    
    





    this.delete = function (url, id, loaderElem) {

    	 var token = this.checkLogin(url);
    
        var deferred = $q.defer();

        if (loaderElem)
            $(loaderElem).addClass("loading");

        $http({
            method: 'DELETE',
            url: this.urlFor(url),
            params: id,
            headers: {
                'Authorization': token
            },
        })
            .success(function (data) {
            
              if (loaderElem)
                  $(loaderElem).removeClass("loading");
                  deferred.resolve(data);
              })
            .error(function (error, status) {
                  if (loaderElem)
            $(loaderElem).removeClass("loading");
            if (status == 401) {  //  temporary detect login calls
                self.toLogin();
            } else {
                if (loaderElem) {
                     $(loaderElem).dimmer({closable:false, 
                     template : {
                          dimmer: function() {
                           return $('<div class="ui dimmer"><div class="content"><div class="center"><i class="huge frown icon"></i> <h3>Произошла ошибка</h3></div></div></div>').attr('class', 'ui dimmer');
                          }
                        }});
                    
                    $(loaderElem).dimmer('show');
                    
                }
                deferred.reject(error);
            }
        });

        return deferred.promise;

    };



}