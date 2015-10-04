/**
 * Created by Alibek on 01.10.2015.
 */
var ModelBase = require('../base/modelBase');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

exports.definition = _.extend({
        period: {type: number, required: "#period required"},
        fizClientCount: {type: number},
        jurClientCount: {type: number},
        balances: [Schema.Type.Mixed],
        sum: {type: number},
        isClosed: {type: Boolean},
        month: {type: number},
        year: {type: year}
    },
    ModelBase
);