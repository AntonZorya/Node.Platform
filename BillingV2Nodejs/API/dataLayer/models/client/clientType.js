var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition = _.extend({
    name: {type: String, required: "#name required"},
    tariffId: {type: Schema.Types.ObjectId, ref: 'Tariff'}
    /*priceWater: { type: Number},
     priceKanal: {type:Number}*/
}, ModelBase);

