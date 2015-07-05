var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var phones = require(_modelsPath + 'client/phones').definition;
var clientCounters = require(_modelsPath + 'client/clientCounters').definition;

exports.definition = _.extend({
	number: {type:String},
	name: { type: String, required: "#name required" },
	bin: {type: String, required: "#bin required"},
	rnn: {type: String},
	address: {type: String, required: "#address required"},
	street: {type: String},
	house: {type: String},
	ap: {type:String},
	period: {type: Number},
	counters: clientCounters,
	controllerId: {type: Schema.Types.ObjectId, ref:'Controller', required: true},
	clientTypeId: {type: Schema.Types.ObjectId, ref:'ClientType', required: true},
	isCounter: {type: Boolean},
	waterPercent: {type: Number},
	canalPercent: {type: Number}
}, ModelBase);

