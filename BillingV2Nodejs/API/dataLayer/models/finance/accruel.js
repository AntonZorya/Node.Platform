var _ = require('underscore');
var ModelBase = require('../base/modelBase');
var OrganizationDef = require('../identity/organization').definition;

exports.definition = _.extend({
	organization: OrganizationDef
}, ModelBase);
