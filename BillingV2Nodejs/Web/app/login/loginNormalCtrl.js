/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('loginNormalCtrl', ['dataService', '$scope', '$cookieStore','validationSvc', '$location', '$routeParams', loginCtrl]);

function loginCtrl(dataSvc, $scope,$cookie, valSvc, $location, $routeParams) {

	valSvc.init($scope);
    $scope.vm = this;
	$scope.login = {userName: "",
	password:"",
	rememberMe: ""};
	
	
	$scope.logIn = function(){
		dataSvc.post("/identity/login", $scope.login, $("#loginForm"), $scope).then(function(data){
			 //$cookie.put('ArndBooksAuthToken', );
			$.cookie("ArndBooksAuthToken", "Bearer"+" "+data.result, { path: '/' });
			 
			 window.location =  $routeParams.url || "/#/main";
		});
	};
	
	
  	$("#loginWindow").transition('drop');

  	$scope.register = function() {
  		$location.path('/login');
  	};
	
}
