var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    districtId: {type: String}
}, ModelBase);
