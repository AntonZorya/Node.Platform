var ModelBase = require('../base/modelBase');
var _ = require('underscore');

exports.definition =  _.extend( { 
	name: {type: String, required: true},
	shortName: {type: String, required: true},
	menuItems: [require('./menuItem')]
},ModelBase);
