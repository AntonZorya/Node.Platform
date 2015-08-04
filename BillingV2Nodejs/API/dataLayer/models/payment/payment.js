var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore');

exports.definition = _.extend({
    clientId: {type: schema.Types.ObjectId, ref: 'ClientJur', required: true},
    personType: {type: Number, required: '#personType required'}, //0 - физ., 1 - юр.
    sum: {type: Number, required: '#sum required'},
    date: {type: Date, required: '#date required'},
    receiptNumber: {type: Number, required: '#receiptNumber required'} // номер квитанции
}, modelBase);


