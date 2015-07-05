var _ = require('underscore');
var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.definition = _.extend({
    name: { type: String, required: true },
    description: { type: String, required: true },
    facilityTypeId: { type: Schema.Types.ObjectId, ref: "FacilityType", reuired: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, ModelBase);