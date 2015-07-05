/* global _repositoriesPath */
var TranslationRepo = require(_repositoriesPath + 'i18n/translationRepo');
var ApplicationRepo = require(_repositoriesPath + 'config/applicationRepo');
var async = require('async');
var translationValidator = require(_helpersMongoosePath + 'validator');
var translationDefinition = require(_modelsPath + 'i18n/translation');

exports.add = function (translation, done) {

	translationValidator('translation', translationDefinition, translation, function (validationRes) {
		if (validationRes.operationResult == 0) {

			async.parallel([
				function (callback) {
					if (translation.text) {
						TranslationRepo.getByText(translation.text, function (data) {
							if (data.operationResult == 0 && data.result != null) {
								return callback({ operationResult: 3, result: ["#translation already exist"] }, null);
							}
							else if (data.operationResult == 0 && data.result == null) {
								return callback(null, null);
							}
							else if (data.operationResult == 1) {
								return callback(data, null);
							}
							else return callback({ operationResult: 3, result: ["#unknown error"] }, null);
						});
					}
					else {
						return callback(null, null);
					}
				},
				function (callback) {
					if (translation.application) {
						ApplicationRepo.getById(translation.application, function (data) {
							if (data.operationResult == 0 && data.result != null) {
								return callback(null, null);
							}
							else if (data.operationResult == 0 && data.result == null) {
								return callback({ operationResult: 3, result: ["#application not exist"] }, null);
							}
							else if (data.operationResult == 1) {
								return callback(data, null);
							}
							else return callback({ operationResult: 3, result: ["#unknown error"] }, null);
						});
					}
					else {
						return callback(null, null);
					}
				},
				function (callback) {
					if (translation.translate === undefined || translation.translate.length == 0) {
						return callback({ operationResult: 2, result: ["#empty array passed"] });
					}
					return callback(null, null);
				}
			],
				// optional callback
				function (err, results) {
					if (err) return done(err);
					TranslationRepo.add(translation, function (data) {
						done(data);
					});
				});
		}
		else {
			return done(validationRes);
		}
	});

};

exports.getByText = function (req, done) {

	if (req.text) {
		TranslationRepo.getByText(req.text, function (data) {
			return done(data);
		});
	}
	else {
		return done({ operationResult: 2, result: ["#text not found"] });
	}
};

exports.getAllTranslations = function (req, done) {
	if (req.languageCode) {
		TranslationRepo.getAllTranslations(function (data) {
			if (data.operationResult == 0 && data.result != null) {
				var translations = {};
				async.each(data.result, function (translation, callback) {
					if (translation.translate && translation.translate.length > 0) {
						async.eachSeries(translation.translate, function (item, callback) {
							if (item.languageCode) {
								if (item._doc.languageCode == req.languageCode && item._doc.text != "") {
									translations[translation.text] = item.text;
									return callback("translation found");
								}
								else {
									translations[translation.text] = translation.text;
								}
							}
							else {
								translations[translation.text] = translation.text;
							}
							callback();
						}, function (err) { });
					}
					else {
						translations[translation.text] = "#no translations found";
					}
					callback();
				}, function (err) {
						// if any of the file processing produced an error, err would equal that error
						if (err) {
							// One of the iterations produced an error.
							// All processing will now stop.
							return done({ operationResult: 1, result: err });
						} else {
							return done(translations);
						}
					});
			}
			else {
				return done(data);
			}
		});
	}
	else {
		TranslationRepo.getAllTranslations(function (data) {
			return done(data);
		})
	}
};

exports.updateAllTranslations = function (req, done) {

	if (req.translations) {

		async.each(req.translations, function (translation, callback) {
			if (translation._id) {
				TranslationRepo.updateOrCreateTranslation(translation, function (data) {
					callback();
				});
			}
			else {
				module.exports.add(translation, function (data) {
					callback();
				});
			}


		}, function (err) {
				// if any of the file processing produced an error, err would equal that error
				if (err) {
					// One of the iterations produced an error.
					// All processing will now stop.
					return done({ operationResult: 1, result: err });
				} else {
					return done({ operationResult: 0 });
				}
			});
	}
	else {
		return done({ operationResult: 2, result: ["#nothing to save"] });
	}
};