var ModelBase = require('../base/modelBase');
var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition = _.extend({
	documentNumber: { type: String, required: "#documentNumber required" },
	issuedBy: { type: String, required: "#issuedBy required" },
	issueDate: { type: Date, required: "#issueDate required" },
	validThru: { type: Date, required: "#validThru required" },
	files: [{ type: Schema.Types.ObjectId }]

}, ModelBase);