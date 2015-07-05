i18nModule = angular.module('i18nModule', ['commonModule', 'pascalprecht.translate'])
    .config(['$translateProvider', '$translatePartialLoaderProvider', 'API_HOST', i18nConfig]);


function i18nConfig(translateProv, translatePartProv, API_HOST){


    translateProv.useLoader('$translatePartialLoader', {
        urlTemplate: API_HOST + '/translations/?languageCode={lang}&applicationname={part}'
    });
    var defaultLanguage = $.cookie("ArndChoosenLang");
    translateProv.preferredLanguage(defaultLanguage?defaultLanguage:'ru');
    //translatePartProv.addPart("identity", 0);
}