var ClientJurDef = require('../../models/client/clientJur');
var clientTypeDef = require('../../models/client/clientType');
var CollectionSchema = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef, true);
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
var ClientType = new require('../../../helpers/mongoose/modelBuilder')('ClientType', clientTypeDef);

var addressDef = require('../../models/location/address');
var Address = new require('../../../helpers/mongoose/modelBuilder')('Address', addressDef);

var tariffDef = require('../../models/tariff/tariff');
var Tariff = new require('../../../helpers/mongoose/modelBuilder')('Tariff', tariffDef);

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
CollectionSchema.plugin(deepPopulate, {
    whitelist: [
        'tariffId',
        'addressId',
        'controllerId'
    ]
});


exports.add = function (client, done) {
    var model = Collection(client);
    model.save(function (err) {
        if (err) return done(errorBuilder(err));
        done({ operationResult: 0 });
    });
};

exports.getAll = function (orgId, done) {
    Collection.find({ isDeleted: false }).populate("controllerId").populate('addressId').exec(function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: clients });
    });
};

exports.getAllByCtrlId = function (ctrlId, done) {
    Collection.find({ isDeleted: false, controllerId: ctrlId }, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: clients });
    });
};

exports.get = function (id, done) {
    Collection.findById(id, { isDeleted: false }).deepPopulate('tariffId addressId').exec(function (err, client) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: client });
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
        return done({ operationResult: 1, result: "#clientNotFound" });
    }
};

exports.delete = function (id, done) {
    if (id) {
        Collection.findOneAndUpdate({ _id: id }, { isDeleted: true }, function (err) {
            if (err) return done(errorBuilder(err));
            return done({ operationResult: 0 });
        });
    }
};

exports.report1 = function (period, done) {
    Collection.aggregate(
        { $unwind: "$pipelines" },
        { $unwind: "$pipelines.counters" },
        // { $limit: 2 },
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
                        date: { $add: ["$pipelines.counters.dateOfCurrentCounts", 6 * 60 * 60 * 1000] }
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
            return done({ operationResult: 0, result: result });
        }
        );
};

exports.report2 = function (period, done) {
    Collection.aggregate(
        { $unwind: "$counters" },
        {
            $match: {

                $and: [
                    { period: parseInt(period) },
                    { "counters.currentCounts": { $ne: null } },
                    { "counters.currentCounts": { $ne: "" } },
                    { "counters.currentCounts": { $ne: 0 } },
                    { "counters.dateOfCurrentCounts": { $ne: null } }
                ]

            }
        },
        {
            $project: {
                counterId: "$counters._id",
                controllerId: 1,
                currentCounts: "$counters.currentCounts",
                yearMonthDay: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $add: ["$counters.dateOfCurrentCounts", 6 * 60 * 60 * 1000] }
                    }
                },
            }
        },

        {
            $group: {
                _id: { controllerId: "$controllerId", yearMonthDay: "$yearMonthDay" },
                total: { $sum: "$currentCounts" }
            }
        },

        function (err, result) {
            if (err) return done(errorBuilder(err));
            return done({ operationResult: 0, result: result });
        }
        );
};

exports.search = function (searchTerm, done) {
    Collection
        .find(
            { $text: { $search: searchTerm } },
            { score: { $meta: "textScore" } },
            { '$limit': 20 }
            )
        .sort({ score: { $meta: 'textScore' } })
        .populate('clientType.tariffId')
        .populate('addressId')
        .populate('controllerId')
    //.deepPopulate('tariffId addressId controllerId')
        .exec(function (err, docs) {
            if (err) return done(errorBuilder(err));
            return done({ operationResult: 0, result: docs });

        });
};

exports.updateClientCounter = function (body, done) {
    var pipelineIndex = body.pipelineIndex;
    var conditions = { '_id': body.clientId, 'pipelines.counters._id': body.counter._id },
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
        return done({ operationResult: 0, result: counter });
    }

};