/// <reference path="../../../typings/underscore/underscore.d.ts"/>
billingApplication.service('validationSvc', ['$http', '$q', '$location', '$window', '$cookieStore', 'API_HOST', validationSvc]);

function validationSvc(){
	this.init = function($scope){
		$scope.validate = this;
        $scope.validationErrors = [];
        $scope.commonErrors = [];
        $scope.isErrorForField = this.isErrorForField;
        $scope.getErrorForField = this.getErrorForField;
	};
	
	this.isErrorForField = function(fieldName, scope) {
        //if (scope.validationErrors != undefined)
        //    return _.any(scope.validationErrors, function(elem) { return elem.path == fieldName; });
        //    else
        //        return false;

        return (fieldName in scope.validationErrors);
    };

     this.getErrorForField = function (fieldName, scope) {
        //if (scope.validationErrors != undefined)
        //    if (_.any(scope.validationErrors, function(elem) { return elem.path == fieldName; }))
        //        return _.where(scope.validationErrors, { path: fieldName })[0].message;
        //    else return "";
        //else
        //    return "";
         if(scope.validationErrors[fieldName])
            return scope.validationErrors[fieldName].message;
         else return "";
    };

    this.addError = function(message) {
        $scope.coomonErrors.push(message);
    }
}