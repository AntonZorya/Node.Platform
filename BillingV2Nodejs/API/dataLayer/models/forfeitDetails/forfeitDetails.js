var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
//Штрафы
exports.definition = _.extend({

    balanceId: {type: Schema.Types.ObjectId, ref: 'Balance', required: true},
    comment: {type: String},
    filesIds: {type: Array},
    clientJurId: {type: Schema.Types.ObjectId, ref: 'ClientJur'},

    period: {type: Number, required: true},
    //аудит
    date: {type: Date, required: '#date required'},
    userId: {type: Schema.Types.ObjectId, required: true}

}, ModelBase);