var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
//Штрафы
exports.definition = _.extend({

    balanceId: {type: Schema.Types.ObjectId, ref: 'BalanceFiz', required: true},
    comment: {type: String},
    filesIds: {type: Array},
    clientId: {type: Schema.Types.ObjectId, ref: 'ClientFiz'},

    period: {type: Number, required: true},
    //аудит
    date: {type: Date, required: '#date required'},
    userId: {type: Schema.Types.ObjectId, required: true}

}, ModelBase);