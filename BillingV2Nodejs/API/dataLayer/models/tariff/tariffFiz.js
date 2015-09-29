var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

exports.definition = _.extend({
    name: {type: String},
    water: {type: Number},
    canal: {type: Number},
    date: {type: Date}
}, ModelBase);