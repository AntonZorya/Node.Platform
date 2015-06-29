var LanguageRepo = require(_repositoriesPath + 'i18n/languageRepo');
var languageDefinition = require(_modelsPath + 'i18n/languages');
var languageValidator = require(_helpersMongoosePath + 'validator');
var async = require('async');

exports.add = function (language, done) {

	languageValidator('language', languageDefinition, language, function (validationRes) {
		if (validationRes.operationResult == 0) {
			if (language.languageCode) {
				LanguageRepo.getByLanguageCode(language.languageCode, function (data) {
					if (data.operationResult == 0 && data.result != null) {
						return done({ operationResult: 3, result: ["#language already exist"] });
					}
					else if (data.operationResult == 0 && data.result == null) {
						LanguageRepo.add(language, function (data) {
							return done(data);
						});
					}
					else if (data.operationResult == 1) {
						return done(data);
					}
					else return done({ operationResult: 3, result: ["#unknown error"] });
				});
			}
			else {
				return done({ operationResult: 3, result: ["#unknown error"] });
			}
		}
		else {
			return done(validationRes);
		}
	});


};

exports.getAllLanguages = function (req, done) {

	LanguageRepo.getAllLanguages(function (data) {
		done(data);
	});

};