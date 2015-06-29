
var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');

exports.definition = _.extend({
    name: { type: String, required: "#name required" },
    priceWater: { type: Number},
    priceKanal: {type:Number}
}, ModelBase);

