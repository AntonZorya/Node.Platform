var ClientJurDef = require('../../models/client/clientJur');
var clientTypeDef = require('../../models/client/clientType');
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef, true);
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
var ClientType = new require('../../../helpers/mongoose/modelBuilder')('ClientType', clientTypeDef);

var calculationDef = require('../../models/calculations/calculation');
var CalculationCollection = new require('../../../helpers/mongoose/modelBuilder')('Calculation', calculationDef);

var forfeitDef = require('../../models/forfeitDetails/forfeitDetails');
var ForfeitCollection = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetails', forfeitDef);
var ForfeitCollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('forfeitDetails', forfeitDef, true);

var controllerDef = require('../../models/identity/controllers');
var ControllerCollection = new require('../../../helpers/mongoose/modelBuilder')('Controller', controllerDef);

var addressDef = require('../../models/location/address');
var Address = new require('../../../helpers/mongoose/modelBuilder')('Address', addressDef);

var tariffDef = require('../../models/tariff/tariff');
var Tariff = new require('../../../helpers/mongoose/modelBuilder')('Tariff', tariffDef);
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var async = require('async');

CollectionSchema.plugin(deepPopulate, {
    whitelist: [
        'tariffId',
        'addressId',
        'controllerId'
    ]
});
ForfeitCollectionSchema.plugin(deepPopulate, {
    whitelist: [
        'balanceId'
    ]
});


exports.add = function (client, done) {
    var model = Collection(client);
    model.save(function (err) {
        if (err)
            return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getByBin = function (bin, done) {
    Collection.findOne({isDeleted: false, bin: bin}).exec(function (err, client) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: client});
    });
};

exports.getAll = function (orgId, done) {
    Collection.find({isDeleted: false}).populate("controllerId").populate('addressId').exec(function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

// For testConsole/updateCurrentCounts
exports.getAll = function (done) {
    Collection.find({isDeleted: false}).exec(function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
}

exports.getAllByCtrlId = function (ctrlId, done) {
    Collection.find({isDeleted: false, controllerId: ctrlId}, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

exports.get = function (id, done) {
    Collection.findById(id, {isDeleted: false}).deepPopulate('tariffId addressId').exec(function (err, client) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: client});
    });
};

exports.update = function (client, done) {
    if (client._id) {
        Collection.findOneAndUpdate({_id: client._id}, client, {new: true}, function (err, res) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: res});
        });
    }
    else {
        return done({operationResult: 1, result: "#clientNotFound"});
    }
};

exports.delete = function (id, done) {
    if (id) {
        Collection.findOneAndUpdate({_id: id}, {isDeleted: true}, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
};

exports.report1 = function (period, done) {
    Collection.aggregate(
        {$unwind: "$pipelines"},
        {$unwind: "$pipelines.counters"},
        {
            $match: {

                $and: [
                    {period: parseInt(period)},
                    {"pipelines.counters.currentCounts": {$ne: null}},
                    {"pipelines.counters.currentCounts": {$ne: ""}},
                    {"pipelines.counters.currentCounts": {$ne: 0}},
                    {"pipelines.counters.dateOfCurrentCounts": {$ne: null}}
                ]

            }
        },
        {
            $project: {
                counterId: "$pipelines.counters._id",
                controllerId: 1,
                yearMonthDay: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: {$add: ["$pipelines.counters.dateOfCurrentCounts", 6 * 60 * 60 * 1000]}
                    }
                },
            }
        },

        {
            $group: {
                _id: {controllerId: "$controllerId", yearMonthDay: "$yearMonthDay"},
                total: {$sum: 1}
            }
        },

        function (err, result) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: result});
        }
    );
};

exports.report5 = function (period, done) {
    Collection.aggregate(
        {
            $match: {

                $and: [
                    {period: parseInt(period)},
                    {"pipelines.counters.currentCounts": {$ne: null}},
                    {"pipelines.counters.currentCounts": {$ne: ""}},
                    {"pipelines.counters.currentCounts": {$ne: 0}},
                    {"pipelines.counters.dateOfCurrentCounts": {$ne: null}}
                ]

            }
        },

        {
            $group: {
                _id: {controllerId: "$controllerId"},
                total: {$sum: 1}
            }
        },

        function (err, result) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: result});
        }
    );
};

exports.report6 = function (period, done) {
    Collection.aggregate(
        {
            $group: {
                _id: {controllerId: "$controllerId"},
                total: {$sum: 1}
            }
        },

        function (err, result) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: result});
        }
    );
};

exports.report2 = function (period, done) {

    var round1Result;
    var round3Result;
    var round4Result;
    var round6Result;
    var round8Result;
    var round10Result;

    async.series([
            function (callback) {

                CalculationCollection
                    .find({period:period})
                    .lean()
                    .exec(function (err, docs) {
                        if (err) {
                            return callback(err, 'ROUND1 ERROR');
                        }
                        round1Result = docs;
                        callback(null, 'ROUND1 SUCCESS');
                    });

            },
            function (callback) {

                async.eachSeries(round1Result, function(doc, callback) {

                    Collection.findById(doc.clientJurId,function(err,client){
                        if(err) return callback();
                        if(client==null) return callback();

                        doc.controllerId = client._doc.controllerId;
                        return callback();

                    });

                }, function (err) {
                    if (err) {
                        return callback(err, 'ROUND2 ERROR');
                    }
                    callback(null, 'ROUND2 SUCCESS');
                });

            },
            function(callback){
                round3Result = _.chain(round1Result)
                    .groupBy(function(value) { return value.controllerId; })
                    .map(function(value, key) {
                        var sumWaterMoney = _.reduce(value, function(memo, val) { return memo + val.waterSum; }, 0);
                        var sumCanalMoney = _.reduce(value, function(memo, val) { return memo + val.canalSum; }, 0);
                        var sumWaterCubic = _.reduce(value, function(memo, val) { return memo + val.waterCubicMetersCount; }, 0);
                        var sumCanalCubic = _.reduce(value, function(memo, val) { return memo + val.canalCubicMetersCount; }, 0);
                        return {
                            controllerId: key,
                            sumWaterMoney: sumWaterMoney,
                            sumCanalMoney: sumCanalMoney,
                            sumWaterCubic: sumWaterCubic,
                            sumCanalCubic: sumCanalCubic
                        };
                    })
                    .value();
                //console.log(round3Result);
                callback(null, 'ROUND3 SUCCESS');
            },
            function(callback){
                Collection.aggregate(
                    {
                        $match: {

                            $and: [
                                {period: parseInt(period)},
                                {"pipelines.counters.currentCounts": {$ne: null}},
                                {"pipelines.counters.currentCounts": {$ne: ""}},
                                {"pipelines.counters.currentCounts": {$ne: 0}},
                                {"pipelines.counters.dateOfCurrentCounts": {$ne: null}}
                            ]

                        }
                    },

                    {
                        $group: {
                            _id: {controllerId: "$controllerId"},
                            total: {$sum: 1}
                        }
                    },

                    function (err, result) {
                        if (err) return callback(err, 'ROUND4 SUCCESS');
                        round4Result = result;
                        //console.log(round4Result);
                        return callback(null, 'ROUND4 SUCCESS');
                    }
                );
            },
            function(callback){
                _.each(round3Result, function(elem){
                    _.each(round4Result, function(elem2){
                        if(elem.controllerId==elem2._id.controllerId){
                            elem.passed = elem2.total;
                        }
                    })
                });
                //console.log(round3Result);
                return callback(null, 'ROUND5 SUCCESS');
            },
            function (callback) {

                ForfeitCollection
                    .find({period:period})
                    .lean()
                    .deepPopulate('balanceId')
                    .exec(function (err, docs) {
                        if (err) {
                            return callback(err, 'ROUND6 ERROR');
                        }
                        round6Result = docs;
                        callback(null, 'ROUND6 SUCCESS');
                    });

            },
            function (callback) {

                async.eachSeries(round6Result, function(doc, callback) {

                    Collection.findById(doc.clientJurId,function(err,client){
                        if(err) return callback();
                        if(client==null) return callback();

                        doc.controllerId = client._doc.controllerId;
                        return callback();

                    });

                }, function (err) {
                    if (err) {
                        return callback(err, 'ROUND7 ERROR');
                    }
                    callback(null, 'ROUND7 SUCCESS');
                });

            },
            function(callback){
                round8Result = _.chain(round6Result)
                    .groupBy(function(value) { return value.controllerId; })
                    .map(function(value, key) {
                        var sumForfeitMoney = _.reduce(value, function(memo, val) { return memo + val.balanceId.sum; }, 0);
                        return {
                            controllerId: key,
                            sumForfeitMoney: sumForfeitMoney
                        };
                    })
                    .value();
                //console.log(round8Result);
                callback(null, 'ROUND8 SUCCESS');
            },
            function(callback){
                _.each(round3Result, function(elem){
                    _.each(round8Result, function(elem2){
                        if(elem.controllerId==elem2.controllerId){
                            elem.sumForfeitMoney = elem2.sumForfeitMoney;
                        }
                    })
                });
                //console.log(round3Result);
                return callback(null, 'ROUND9 SUCCESS');
            },
            function(callback){
                ControllerCollection
                    .find()
                    .lean()
                    .exec(function (err, docs) {
                        if (err) {
                            return callback(err, 'ROUND10 ERROR');
                        }
                        round10Result = docs;
                        callback(null, 'ROUND10 SUCCESS');
                    });
            },
            function(callback){
                _.each(round3Result, function(elem){
                    _.each(round10Result, function(elem2){
                        if(elem.controllerId==elem2._id){
                            elem.controllerId = elem2.fullName;
                        }
                    })
                });
                //console.log(round3Result);
                callback(null, 'ROUND11 SUCCESS');
            },
            function(callback){
                _.each(round3Result, function(elem){
                    elem.sumTotalMoney = (elem.sumWaterMoney?elem.sumWaterMoney:0)
                        +(elem.sumCanalMoney?elem.sumCanalMoney:0)
                        +(elem.sumForfeitMoney?elem.sumForfeitMoney:0);
                });
                _.each(round3Result, function(elem){//toFixed(2)
                    if(elem.sumWaterMoney)
                        elem.sumWaterMoney = elem.sumWaterMoney.toFixed(2);
                    if(elem.sumCanalMoney)
                        elem.sumCanalMoney = elem.sumCanalMoney.toFixed(2);
                    if(elem.sumWaterCubic)
                        elem.sumWaterCubic = elem.sumWaterCubic.toFixed(2);
                    if(elem.sumCanalCubic)
                        elem.sumCanalCubic = elem.sumCanalCubic.toFixed(2);
                    if(elem.sumForfeitMoney)
                        elem.sumForfeitMoney = elem.sumForfeitMoney.toFixed(2);
                    if(elem.sumTotalMoney)
                        elem.sumTotalMoney = elem.sumTotalMoney.toFixed(2);
                });
                _.each(round3Result, function(elem){
                    if(elem.controllerId == "undefined")
                        elem.controllerId="Нет контролера";
                });
                //console.log(round3Result);
                callback(null, 'ROUND12 SUCCESS');
            }

        ],
        function (err, results) {
            // results is now equal to ['one', 'two']
            if (err) return done(errorBuilder(err));
            done({ operationResult: 0, result: round3Result });
        });

};

exports.search = function (searchTerm, period, user, done) {
    if (user.controllerId) {//test commit
        Collection
            .find(
            {
                $and: [
                    {controllerId: user.controllerId},
                    {period: period},
                    {$text: {$search: searchTerm}}
                ]
            },
            {score: {$meta: "textScore"}},
            {'$limit': 20}
        )
            .sort({score: {$meta: 'textScore'}})
            .populate('clientType.tariffId')
            .populate('addressId')
            .populate('controllerId')
            .populate('kskId')
            .exec(function (err, docs) {
                if (err) return done(errorBuilder(err));

                return done({operationResult: 0, result: docs});

            });
    } else {
        Collection
            .find(
            {
                $and: [
                    {period: period},
                    {$text: {$search: searchTerm}}
                ]
            },

            {score: {$meta: "textScore"}},
            {'$limit': 20}
        )
            .sort({score: {$meta: 'textScore'}})
            .limit(20)
            .populate('clientType.tariffId')
            .populate('addressId')
            .populate('controllerId')
            .populate('kskId')
            .exec(function (err, docs) {
                if (err) return done(errorBuilder(err));
                return done({operationResult: 0, result: docs});

            });
    }

};

exports.updateClientCounter = function (body, done) {
    var pipelineIndex = body.pipelineIndex;
    var conditions = {'_id': body.clientId, 'pipelines.counters._id': body.counter._id},
        update = {
            $set: {
                //'pipelines.$.counters.$': body.counter
                //'pipelines.0.counters.$.currentCounts': body.counter.currentCounts,
                /*'counters.$.problemDescription': body.counter.problemDescription,
                 'counters.$.dateOfCurrentCounts': body.counter.dateOfCurrentCounts,
                 'counters.$.hasProblem': body.counter.hasProblem,
                 'counters.$.isCountsByAvg': body.counter.isCountsByAvg,
                 'counters.$.countsByAvg': body.counter.countsByAvg*/
            }
        },
        options = {
            multi: false
        };

    Collection.update(
        conditions,
        update,
        options,
        callback
    );

    function callback(err, counter) {
        if (err)
            return done(errorBuilder(err));
        return done({operationResult: 0, result: counter});
    }

};

exports.getPeriods = function (done) {
    Collection.find().distinct('period', function (err, periods) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: periods});
    });
};