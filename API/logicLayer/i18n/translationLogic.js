var TranslationRepo = require(_repositoriesPath+'i18n/translationRepo');

exports.add = function(translation, done){
	TranslationRepo.add(translation, function(data){
		done(data);
	});
}

exports.getByText = function(text, done){
	TranslationRepo.getByText(text, function(data){
		done(data);
	});
}

exports.getAllTranslations = function(done){
	TranslationRepo.getAllTranslations(function(data){
		done(data);
	})
}
