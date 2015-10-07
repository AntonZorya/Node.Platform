var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counters = require(_modelsPath + 'client/pipelineCounters').definition;

exports.definition = [{
    number: {type: Number, required: true},
    description: {type: String},
    addressId: {type: Schema.Types.ObjectId, ref: 'Address'},
    counters: counters,

    waterPercent: {type: Number},
    canalPercent: {type: Number},

    isActive: {type: Boolean},

    fileIds: [],//счет фактуры,

    sourceCounts: {type: Number},// 0 по счетчику, 1 по среднему, 2 по норме
    avg: {type: Number}, //среднее - должно расчитываться на основе предыдущих месяцев или пользователь может вбить сам
    norm: {type: Number} //норма

}];

