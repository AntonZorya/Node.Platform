var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

exports.definition = _.extend({
    addressTypeId: {type: Schema.Types.ObjectId}, //
    name: {type: String},
    parentId: {type: Schema.Types.ObjectId},
}, ModelBase);