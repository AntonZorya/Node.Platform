var ModelBase = require('../base/modelBase');
var _ = require('underscore');


exports.definition =  _.extend({ 
	roleName: {type: String, required: true},
	

},ModelBase);