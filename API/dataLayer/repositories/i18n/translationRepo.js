var TranslationDef = require(_modelsPath + 'i18n/translation');
var Collection = new require(_helpersMongoosePath + 'modelBuilder')('Translation', TranslationDef);

exports.add = function (translation, done) {
	var model = Collection(translation);
	model.save(function (err) {
		if (err) return done(errorBuilder(err));
		done({ operationResult: 0 });
	});
};

exports.getByText = function (text, done) {
	Collection.findOne().and([{ text: text }, { isDeleted: false }]).exec(function (err, translation) {
		if (err) return done(errorBuilder(err));
		done({ operationResult: 0, result: translation });
	});
};

exports.getAllTranslations = function (done) {
	Collection.find(function (err, translations) {
		if (err) return done(errorBuilder(err));
		done({ operationResult: 0, result: translations });
	});
};

exports.updateOrCreateTranslation = function (translation, done) {
	if (translation._id) {
		Collection.findOneAndUpdate({ _id: translation._id }, translation, { upsert: true }, function (err) {
			if(err) return done(errorBuilder(err));
			return done({operationResult: 0});
		});
	}
	
	else return done({operationResult: 1, result:"#translation not found"});
};