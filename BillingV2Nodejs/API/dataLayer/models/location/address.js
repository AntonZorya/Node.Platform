var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

exports.definition = _.extend({
    addressTypeId: {type: Schema.Types.ObjectId, ref: 'AddressType', required: true}, /*, */
    value: {type: String, required: true},
    parentId: {type: Schema.Types.ObjectId},
    parentAddresses: []
}, ModelBase);