var ModelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


exports.definition = _.extend({
    balanceId: {type: Schema.Types.ObjectId, ref: 'Balance', required: true}, //
    receiptNumber: {type: Number, required: '#receiptNumber required'}, // номер квитанции
    clientJurId: {type: Schema.Types.ObjectId, ref: 'ClientJur', required: true},

    period: {type: Number, required: true},
    //аудит
    date: {type: Date, required: '#date required'},
    userId: {type: Schema.Types.ObjectId, required: true}



}, ModelBase);


