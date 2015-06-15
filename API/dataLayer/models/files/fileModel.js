var _ = require('underscore');
var ModelBase = require('../base/modelBase');

exports.definition = _.extend({
    fileName: { type: String, required: true },
    description: { type: String, required: true },
    isConverted: {type: Boolean}
}, ModelBase);