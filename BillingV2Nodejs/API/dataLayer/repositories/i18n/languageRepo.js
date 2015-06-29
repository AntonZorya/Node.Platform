var LanguageDef = require(_modelsPath+'i18n/languages');
var Collection = new require(_helpersMongoosePath+'modelBuilder')('Languages', LanguageDef);

exports.add = function(language, done){
	var model = Collection(language);
	model.save(function(err){
		if(err) return done(errorBuilder(err));
		done({operationResult:0});
	});
};

exports.getByLanguageCode = function(languageCode, done){
	Collection.findOne({languageCode: languageCode}, function(err, language){
		if(err) return done(errorBuilder(err));
		done({operationResult:0, result: language});
	});
};

exports.getAllLanguages = function(done){
	Collection.find(function(err, languages){
		if(err) return done(errorBuilder(err));
		done({operationResult:0, result: languages});
	});
};