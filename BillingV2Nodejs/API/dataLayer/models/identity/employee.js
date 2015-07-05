var ModelBase = require('../base/modelBase');
var _ = require('underscore');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

exports.definition =  _.extend({ 		
	name: { type: String, required: true },
	surname: { type: String, required: true},
	iin: { type: String, required: true},
	username: { type: String, required: false},
	password: { type: String, required: false},
	isUser: {type: Boolean, required: true},
	organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true}
}, ModelBase);