
var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');

exports.definition = _.extend({
	fullName: { type: String, required: "#name required" },
	code: {type: String}
}, ModelBase);

