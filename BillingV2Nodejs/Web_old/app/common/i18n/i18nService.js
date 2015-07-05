i18nModule.service('i18nSvc', ['$translatePartialLoader', '$translate', i18nSvc]);

function i18nSvc(translatePartialLoader, translateSvc){

    this.addPartialTranslation = function(name){
        translatePartialLoader.addPart(name);
        translateSvc.refresh();
    }


    this.changeLanguage = function(lang){

        translateSvc.use(lang);

    }


}