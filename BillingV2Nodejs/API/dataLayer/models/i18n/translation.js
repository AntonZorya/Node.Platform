var ModelBase = require('../base/modelBase');

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

exports.definition =  _.extend( { 
	text: {type: String, required: true},
	application: { type: Schema.Types.ObjectId, ref: 'application', required: false},
	translate: _i18nString
}, ModelBase);