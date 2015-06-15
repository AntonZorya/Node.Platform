var _ = require('underscore');
var ModelBase = require('../base/modelBase');

exports.definition = _.extend({
    name: { type: String, reuired: true },
    description: { type: String, required: true },
    propertiesTemplate: { type: String },
    iconClass: {type: String}

}, ModelBase);