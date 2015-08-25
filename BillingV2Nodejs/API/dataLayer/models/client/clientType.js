var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*exports.definition = {
    _id: {type: Schema.Types.ObjectId},
    name: {type: String, required: "#name required"},
    tariffId: {type: Schema.Types.ObjectId, ref: 'Tariff'},
    minConsumption: {type: Number},
    avgConsumption: {type: Number},
    maxConsumption: {type: Number},
    parentId: {type: Schema.Types.ObjectId},

    isDeleted: {type: Boolean},
    createDateTime: {type: Date}
};*/

exports.definition = _.extend({
 name: {type: String, required: "#name required"},
 tariffId: {type: Schema.Types.ObjectId, ref: 'Tariff'},
 minConsumption: {type: Number},
 avgConsumption: {type: Number},
 maxConsumption: {type: Number},
 parentId: {type: Schema.Types.ObjectId}
 }, ModelBase);

