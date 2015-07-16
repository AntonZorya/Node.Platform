/// <reference path="../../../typings/jquery/jquery.d.ts"/>
billingApplication.controller('loginCtrl', ['dataService', '$scope', '$cookieStore','validationSvc', '$location', '$indexedDB', loginCtrl]);

function loginCtrl(dataSvc, $scope,$cookie, valSvc, $location, $indexedDB) {
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

			if(data.operationResult==0){


				$indexedDB.openStore('user',function(store){

					store.clear().then(function(){


					store.insert(data.result).then(function(e){
						//alert('userSaved');


						dataSvc.get("/clientsByCtrl", {controllerId:data.result._id}).then(function(data){

							$indexedDB.openStore('objects',function(store) {

								store.clear().then(function () {

									_.each(data.result, function(facility){
										if(_.all(facility.counters, function(item){
												return (item.currentCounts>item.lastCounts || item.hasProblems);
											})){
											facility.uploaded = true;
										}
									});

									store.insert(data.result).then(function(e) {


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