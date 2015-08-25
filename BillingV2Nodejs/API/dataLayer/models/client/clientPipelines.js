var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counter = require(_modelsPath + 'client/pipelineCounter').definition;

exports.definition = [{
    number: {type: Number, required: true},
    description: {type: String},
    addressId: {type: Schema.Types.ObjectId, ref: 'Address'},
    counter: counter,

    isByCounter: {type: Boolean},//по норме или по счетчику
    waterPercent: {type: Number},
    canalPercent: {type: Number},

    isActive: {type: Boolean},

    fileIds: []//счет фактуры

}];

