/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('loginCtrl', ['dataService', '$scope', '$cookieStore','validationSvc', '$location', '$indexedDB', loginCtrl]);

function loginCtrl(dataSvc, $scope,$cookie, valSvc, $location, $indexedDB) {
	alert("here");
	valSvc.init($scope);
    $scope.vm = this;
	$scope.login = {userName: "",
	password:"",
	rememberMe: ""};
	
	
	$scope.logIn = function(){
		dataSvc.post("/identity/loginController", $scope.login, $("#loginForm"), $scope).then(function(data){
			//var url = getQueryStringValue("url");
			 //$cookie.put('ArndBooksAuthToken', );
			//$.cookie("ArndBooksAuthToken", "Bearer"+" "+data.result, { path: '/' });
			alert('all ok');
			if(data.operationResult==0){
					alert('data.operation is good');

				$indexedDB.openStore('user',function(store){
					alert('Store is opened');
					store.clear().then(function(){
						alert('Store sleared opened');

					store.insert(data.result).then(function(e){
						//alert('userSaved');


						dataSvc.get("/clientsByCtrl", {controllerId:data.result._id}).then(function(data){
							alert("Got data");
							$indexedDB.openStore('objects',function(store) {
								alert("Opened store");
								store.clear().then(function () {
									alert("Done with clear");
									store.insert(data.result).then(function(e) {

										alert("Done with data");
										window.location =  "/#/controller/main";
									});
								});
							});


						});


					});
					});
				});




			}


		});
	};
	
	
  	$("#loginWindow").transition('drop');

  	$scope.register = function() {
  		$location.path('/loginNormal');
  	};
	
}

function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  