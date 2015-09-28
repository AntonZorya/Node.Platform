var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore'),
    tariff = require(_modelsPath + 'tariff/tariffFiz').definition;

exports.definition = _.extend({
    clientId: {type: schema.Types.ObjectId, ref: 'ClientFiz', required: true},
    pipelineId: {type: schema.Types.ObjectId},
    counterId: {type: schema.Types.ObjectId},
    balanceId: {type: schema.Types.ObjectId, ref: 'BalanceFiz', required: true},
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
    userId: {type: schema.Types.ObjectId, required: true},

    calculationType: {type: Number}, //0 - �� ��������, 1 - �� ��������,
    daysCountByAvg: {type: Number}

}, modelBase);


