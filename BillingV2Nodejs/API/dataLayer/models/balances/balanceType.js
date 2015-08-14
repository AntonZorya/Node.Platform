var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore');

exports.definition = _.extend({
    name: {type: String}
}, modelBase);




