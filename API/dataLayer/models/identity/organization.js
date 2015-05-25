var ModelBase = require('../base/modelBase');
var _ = require('underscore');

module.exports =  _.extend({ 		
	organizationName: { type: String, required: true }
	
}, ModelBase);


