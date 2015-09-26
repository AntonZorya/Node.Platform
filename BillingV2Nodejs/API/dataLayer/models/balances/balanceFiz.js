var modelBase = require('../base/modelBase'),
    mongoose = require('mongoose'),
    schema = mongoose.Schema,
    _ = require('underscore');


exports.definition = _.extend({
    balanceTypeId: {type: schema.Types.ObjectId, ref: "BalanceType", required: true}, //
    clientId: {type: schema.Types.ObjectId, ref: "ClientFiz"},
    counterId: {type: schema.Types.ObjectId},
    sum: {type: Number},
    period: {type: Number, required: true},
    //аудит
    date: {type: Date},
    userId: {type: schema.Types.ObjectId, required: true}
}, modelBase);


/**
 * Created by Alibek on 26.09.2015.
 */
