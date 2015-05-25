var ModelBase = require('../base/modelBase');
var _ = require('underscore');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports =  _.extend({ 
	userName: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true}
});
