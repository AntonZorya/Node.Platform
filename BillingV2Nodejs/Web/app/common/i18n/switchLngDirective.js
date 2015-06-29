i18nModule.directive('switchLng', ['dataService', 'i18nSvc', 'API_HOST', switchLng]);

function switchLng(dataService,transSvc,  api_host) {
    return {

        scope: {
        },
        templateUrl: '/app/Common/i18n/switchLng.html',
        link: function (scope, element, attrs, tabsCtrl) {

            var defaultLanguage = $.cookie("ArndChoosenLang");

            scope.selection = false;
            if(attrs.selection){
                scope.selection = true;
            }


            dataService.get('/languages', {}).then(function (data) {
                console.log(data);

                if(defaultLanguage){
                 scope.selectedLang = _.find(data.result, function(elem){
                     return elem.languageCode == defaultLanguage;
                 })} else{
                    scope.selectedLang = _.first(data.result);
                }

                scope.allLanuages = data.result;

                $("#lngSelector").dropdown({
                    onChange: function(value, text, $selectedItem) {
                        $.cookie("ArndChoosenLang", value, { path: '/' });
                        transSvc.changeLanguage(value);
                    }
                });

            });


        }
    };
}