var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    tariffId: {type: Schema.Types.ObjectId, ref: 'Tariff', required: '#tariff required'},
    minConsumption: {type: Number},
    avgConsumption: {type: Number},
    maxConsumption: {type: Number},
    parentId: {type: Schema.Types.ObjectId}
}, ModelBase);

