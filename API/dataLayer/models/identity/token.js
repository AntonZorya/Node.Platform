var ModelBase = require('../base/modelBase');
var _ = require('underscore');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

exports.definition =  _.extend({ 
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
	token: {type: String, required: true},
	isPermanent: {type: Boolean, default: function(){return new Date()}},
	validThru: {type: Date, required: true}
},ModelBase);
