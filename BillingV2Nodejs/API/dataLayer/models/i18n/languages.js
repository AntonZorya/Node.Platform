var ModelBase = require('../base/modelBase');
var _ = require('underscore');

exports.definition = _.extend({
	name: { type: String, required: "#languageName required" },
	languageCode: { type: String, required: "#languageCode required" },
	flagName: { type: String, required: "#flagName required" },
}, ModelBase);