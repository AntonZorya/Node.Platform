var ModelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');


exports.definition = _.extend({
    balanceId: {type: Schema.Types.ObjectId, ref: 'Balance', required: true}, //
    receiptNumber: {type: Number, required: '#receiptNumber required'} // номер квитанции
    /*clientJurId: {type: schema.Types.ObjectId, ref: 'ClientJur', required: true},
     personType: {type: Number, required: '#personType required'}, //0 - физ., 1 - юр.
     sum: {type: Number, required: '#sum required'},
     date: {type: Date, required: '#date required'},*/
}, ModelBase);


