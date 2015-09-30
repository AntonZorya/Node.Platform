var ModelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


exports.definition = _.extend({
    balanceId: {type: Schema.Types.ObjectId, ref: 'BalanceFiz', required: true}, //
    receiptNumber: {type: String, required: '#receiptNumber required'}, // номер квитанции
    clientId: {type: Schema.Types.ObjectId, ref: 'ClientFiz', required: true},

    period: {type: Number, required: true},
    //аудит
    date: {type: Date, required: '#date required'},
    userId: {type: Schema.Types.ObjectId, required: true}

}, ModelBase);


