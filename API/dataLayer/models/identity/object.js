var ModelBase 		= require('../base/ModelBase');
var Counter 		= require('./counter');
var Mongoose 		= require('mongoose');
var Schema 			= Mongoose.Schema;
var _ 				= require('underscore');


exports.definition = _.extend({
	organizationId: 	{ type: Schema.Types.ObjectId, ref: 'Organization', required: true },
	//controllerId: 		{ type: Schema.Types.ObjectId, ref: 'User', required: true },
	name: 				{ type: String, required: true },
	address: 			{ type: String, required: true },
	organizationName: 	{ type: Schema.Types.BigDecimal, required: true },
	organizationNumber: { type: Boolean, required: true },
	counter: 			[ Counter.definition ]
}, ModelBase);