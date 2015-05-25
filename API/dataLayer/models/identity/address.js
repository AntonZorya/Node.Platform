var ModelBase = require('../base/modelBase');
var _ = require('underscore');

module.exports =  {
	city: { type: String, required: true },
	street: {type: String, required: true },
	building: {type: String, required:true},
	office: {type: String, required: false}
}