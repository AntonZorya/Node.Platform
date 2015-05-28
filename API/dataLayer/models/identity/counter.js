var ModelBase 		= require('../base/ModelBase');
var CounterValue 	= require('./counterValue');
var Mongoose 		= require('mongoose'); require('mongoose-big-decimal')(Mongoose);
var Schema 			= Mongoose.Schema;
var _ 				= require('underscore');


exports.definition = _.extend({
	serial: 		{ type: String, required: true },
	module: 		{ type: String, required: true },
	diameter: 		{ type: Schema.Types.BigDecimal, required: true },
	inUse: 			{ type: Boolean, required: true },
	capacity: 		{ type: String, required: false },
	status: 		{ type: String, required: true },
	counterValues: 	[ CounterValue.definition ]
}, ModelBase);