var ModelBase = require('../base/modelBase');
var _ = require('underscore');


module.exports =  _.extend(ModelBase,{ 
	roleName: {type: String, required: true},


});