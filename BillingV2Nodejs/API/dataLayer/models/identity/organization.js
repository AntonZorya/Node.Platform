var ModelBase = require('../base/modelBase');
var _ = require('underscore');

exports.definition =  _.extend({
    organizationName: { type: String, required: true },
    bin: { type: String, required: true },
    desription: {type: String, required: false}
}, ModelBase);


