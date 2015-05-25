var ModelBase = require('../base/modelBase');
var _ = require('underscore');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var systemRoleScheme = new require('../../../helpers/mongoose/modelBuilder')('systemRole', require('./systemRole'), true);

module.exports =  _.extend(ModelBase, { 
	userName: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: false},
	roles: [systemRoleScheme]

});
