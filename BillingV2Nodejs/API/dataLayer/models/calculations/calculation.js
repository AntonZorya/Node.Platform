var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore'),
    tariff = require(_modelsPath + 'tariff/tariff').definition;

exports.definition = _.extend({
    counterId: {type: schema.Types.ObjectId},
    balanceId: {type: schema.Types.ObjectId, ref: 'Balance', required: true},
    cubicMetersCount: {type: Number},
    //tariffId: {type: schema.Types.ObjectId, ref: 'Tariff', required: true},
    tariff: tariff,
    waterSum: {type: Number},
    canalSum: {type: Number}
}, modelBase);


