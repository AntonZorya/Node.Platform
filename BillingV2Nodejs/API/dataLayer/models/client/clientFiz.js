var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var phones = require(_modelsPath + 'client/phones').definition;


exports.definition = _.extend({
	iin: { type: String, required: "#iin required" },
	firstName: { type: String, required: "#firstName required" },
	lastName: { type: String, required: "#lastName required" },
	middleName: { type: String },
	birthDate: { type: Date, required: "#birthDate required" },
	homeAddress: { type: String, required: "#homeAddress required" },
	registrationAddress: { type: String, required: "#registrationAddress required" },
	phones: phones,
	photoId: { type: String },
	organizationId: {type: Schema.Types.ObjectId, required: true}

}, ModelBase);
