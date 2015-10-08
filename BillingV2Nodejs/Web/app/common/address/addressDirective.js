/**
 * Created by vaio on 05.10.2015.
 */
billingApplication.directive('addressInput', addressInput);

function addressInput($http, $compile){

    return {
        restrict: 'E',
        templateUrl: '/app/common/address/addressDirectiveTmp.html',
        scope: {
            addressid: "=",
            addresstext: "="
        },
        link: function(scope, elm, attrs) {
            //console.log(scope.addressid);
            //console.log(scope.addresstext);
            var onceLoaded = false;

            scope.loadConstructor = function(){
                if(!onceLoaded)
                    $http.get('/app/admin/addresses/addresses.html').then(function(data){
                        onceLoaded = true;

                        var elem = $(data.data);
                        //console.log(elem);
                        var compiledElem = $compile(elem);
                        //console.log(compiledElem);
                        var element = compiledElem(scope);
                        //console.log(element);
                        var wrapper = elm.find(".addressConstructorWrapper");
                        wrapper.append(element);
                    });
            };

            scope.closePopup = function(){
                $('.ui.popup')
                    .popup('hide');
                ;
            };

            //console.log(scope);
            //console.log(elm);
            //console.log(attrs);
        }
    };
};