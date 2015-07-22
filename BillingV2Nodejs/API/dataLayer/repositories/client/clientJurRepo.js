var ClientJurDef = require('../../models/client/clientJur');
var clientTypeDef = require('../../models/client/clientType');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef);
var ClientType = new require('../../../helpers/mongoose/modelBuilder')('ClientType', clientTypeDef);

//require('../../../helpers/mongoose/modelBuilder')('ClientJur', ClientJurDef, true).index({ "$**": "text" },
//    { name: "TextIndex" });


exports.add = function (client, done) {
    var model = Collection(client);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getAll = function (orgId, done) {
    Collection.find({isDeleted: false}).populate("clientTypeId").populate("controllerId").exec(function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

exports.getAllByCtrlId = function (ctrlId, done) {
    Collection.find({isDeleted: false, controllerId: ctrlId}, function (err, clients) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};

exports.get = function (id, done) {
    Collection.findById(id, {isDeleted: false}).populate("clientTypeId").populate("controllerId").exec(function (err, client) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: client});
    });
};

exports.update = function (client, done) {
    if (client._id) {
        Collection.findOneAndUpdate({_id: client._id}, client, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: client});
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

exports.report = function (period, done) {
    Collection.aggregate(
        {$unwind: "$counters"},
        {
            $match: {

                $and: [
                    {period: parseInt(period)},
                    {"counters.currentCounts": {$ne: null}},
                    {"counters.currentCounts": {$ne: ""}},
                    {"counters.currentCounts": {$ne: 0}},
                    {"counters.dateOfCurrentCounts": {$ne: null}}
                ]

            }
        },
        {
            $project: {
                counterId: "$counters._id",
                controllerId: 1,
                yearMonthDay: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: {$add: ["$counters.dateOfCurrentCounts", 6 * 60 * 60 * 1000]}
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

exports.reportCounts = function (period, done) {
    Collection.aggregate(
        {$unwind: "$counters"},
        {
            $match: {

                $and: [
                    {period: parseInt(period)},
                    {"counters.currentCounts": {$ne: null}},
                    {"counters.currentCounts": {$ne: ""}},
                    {"counters.currentCounts": {$ne: 0}},
                    {"counters.dateOfCurrentCounts": {$ne: null}}
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
                        date: {$add: ["$counters.dateOfCurrentCounts", 6 * 60 * 60 * 1000]}
                    }
                },
            }
        },

        {
            $group: {
                _id: {controllerId: "$controllerId", yearMonthDay: "$yearMonthDay"},
                total: {$sum: "$currentCounts"}
            }
        },

        function (err, result) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: result});
        }
    );
};


exports.search = function (searchTerm, done) {
    Collection.aggregate({$match: {$text: {$search: searchTerm}}}, function (err, clients) {
        if (err)
            return done(errorBuilder(err));
        return done({operationResult: 0, result: clients});
    });
};


exports.updateClientCounter = function (body, done) {
    var conditions = {'_id': body.clientId, 'counters._id': body.counter._id},
        update = {
            $set: {
                'counters.$.currentCounts': body.counter.currentCounts,
                'counters.$.problemDescription': body.counter.problemDescription,
                'counters.$.dateOfCurrentCounts': body.counter.dateOfCurrentCounts
            }
        },
        options = {
            multi: false
        };

    Collection.update(
        conditions,
        update,
        //options,
        callback
    );

    function callback(err, counter) {
        if (err)
            return done(errorBuilder(err));
        return done({operationResult: 0, result: counter});
    }

};