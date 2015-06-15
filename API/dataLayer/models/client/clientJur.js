var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


exports.definition = _.extend({
	name: { type: String, required: "#name required" },
	registrationDate: { type: Date, required: "#registrationDate required" },
	bin: { type: String, required: "#bin required" },
	registrationCertificateNumber: { type: String, required: "#registrationCertificateNumber required" },
	jurAddress: { type: String, required: "#jurAddress required" },
	factAddress: { type: String, required: "#jurAddress required" }
}, ModelBase);