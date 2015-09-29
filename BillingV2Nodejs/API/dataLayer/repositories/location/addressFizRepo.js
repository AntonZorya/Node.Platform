var definition = new require('../../models/location/addressFiz');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('AddressFiz', definition);

exports.add = function (address, done) {
    var model = new Collection(address);
    model.save(function (err) {
        console.log('add' + err);
        if (err) return done(errorBuilder(err));
        done({operationResult: 0});
    });
};

exports.getById = function (id, done) {
    Collection.findOne({_id: id}, function (err, res) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByAddressTypeId = function (typeId, done) {
    Collection.find({addressTypeId: typeId}, function (err, res) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getByValue = function (value, done) {
    Collection.findOne({value: value, isDeleted: false}, function (err, res) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: res});
    });
};

exports.getChildrenByParentId = function (parentId, done) {
    Collection.find({parentId: parentId, isDeleted: false}, null, {sort: {value: 1}}, function (err, res) {
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