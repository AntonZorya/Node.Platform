var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore'),
    tariff = require(_modelsPath + 'tariff/tariff').definition;

exports.definition = _.extend({
    clientJurId: {type: schema.Types.ObjectId, ref: 'ClientJur', required: true},
    pipelineId: {type: schema.Types.ObjectId},
    balanceId: {type: schema.Types.ObjectId, ref: 'Balance', required: true},
    waterCubicMetersCount: {type: Number},
    canalCubicMetersCount: {type: Number},
    tariff: tariff,
    waterSum: {type: Number},
    canalSum: {type: Number},

    isShortage: {type: Boolean}, //�����/�������,
    shortageCubicMeters: {type: Number}, //������� �3,
    shortageSum: {type: Number}, //������� ��

    period: {type: Number, required: true},
    //�����
    date: {type: Date, required: '#date required'},
    userId: {type: schema.Types.ObjectId, required: true}

}, modelBase);


