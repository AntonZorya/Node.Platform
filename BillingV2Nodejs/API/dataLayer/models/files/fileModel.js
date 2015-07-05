var _ = require('underscore');
var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition = _.extend({
    fileName: { type: String},
    mimeType: {type: String},
    fileType: {
        extension: {type: String},
        isImage: {type: Boolean},
    },
    originalName: { type: String},
    extension: {type: String},
    isConverted: {type: Boolean},
    userId: {type: Schema.Types.ObjectId}
}, ModelBase);