var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore');


exports.definition = _.extend({
    balanceTypeId: {type: schema.Types.ObjectId, ref: "BalanceType", required: true}, //
    clientJurId: {type: schema.Types.ObjectId, ref: "ClientJur"},
    clientFizId: {type: schema.Types.ObjectId, ref: "ClientFiz"},
    counterId: {type: schema.Types.ObjectId},
    date: {type: Date},
    sum: {type: Number}
}, modelBase);


