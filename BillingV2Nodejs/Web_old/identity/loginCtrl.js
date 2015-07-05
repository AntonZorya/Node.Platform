/// <reference path="../../../typings/jquery/jquery.d.ts"/>
arndApplication.controller('loginCtrl', ['dataService', '$scope', '$cookieStore','validationSvc', '$location', loginCtrl]);

function loginCtrl(dataSvc, $scope,$cookie, valSvc, $location) {

	valSvc.init($scope);
    $scope.vm = this;
	$scope.login = {userName: "",
	password:"",
	rememberMe: ""};
	
	
	$scope.logIn = function(){
		dataSvc.post("/identity/login", $scope.login, $("#loginForm"), $scope).then(function(data){
			var url = getQueryStringValue("url");
			 //$cookie.put('ArndBooksAuthToken', );
			$.cookie("ArndBooksAuthToken", "Bearer"+" "+data.result, { path: '/' });
			 
			 window.location =  url || "/#/main";
		});
	};
	
	
  	$("#loginWindow").transition('drop');

  	$scope.register = function() {
  		$location.path('/register');
  	};
	
}

function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  