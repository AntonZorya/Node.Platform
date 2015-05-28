var ModelBase 	= require('../base/ModelBase');
var _ 			= require('underscore');
var Mongoose 	= require('mongoose'); require('mongoose-big-decimal')(Mongoose);
var Schema 		= Mongoose.Schema;

exports.definition = _.extend({
	date: 			{ type: Date, required: true },
	value: 			{ type: Number, required: true },
	//controllerId 	{ type: Schema.Types.ObjectId, required: true }
}, ModelBase);