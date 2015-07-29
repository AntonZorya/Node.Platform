var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore');

exports.definition = _.extend({
    clientId: {type: schema.Types.ObjectId, required: '#clientId required'},
    personType: {type: Number, required: '#personType required'}, //0 - физ., 1 - юр.
    sum: {type: Number, required: '#sum required'},
    date: {type: Date, required: '#date required'}
}, modelBase);


