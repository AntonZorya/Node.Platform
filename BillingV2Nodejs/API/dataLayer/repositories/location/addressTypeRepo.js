var definition = require('../../models/location/addressType');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('AddressType', definition);

exports.add = function (addressType, done) {
    var model = Collection(addressType);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getById = function (id, done) {
    Collection.findOne({_id: id}, function (err, res) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByName = function (name, done) {
    Collection.findOne({name: name, isDeleted: false}, function (err, res) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};


exports.getAll = function (done) {
    Collection.find({isDeleted: false}, null, {sort: {name: 1}}, function (err, res) { //,
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};




