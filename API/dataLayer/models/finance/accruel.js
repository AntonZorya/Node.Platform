var _ = require('underscore');
var ModelBase = require('../base/modelBase');
var OrganizationDef = require('../identity/organization');

module.exports = _.extend({
	organization: OrganizationDef
}, ModelBase);
