var streetDef = require('../../models/location/street');
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Street', streetDef);

exports.add = function (street, done) {
    var model = Collection(street);
    model.save(function (err) {
        if (err)return done(errorBuilder(err));
        done({operationResult: 0});
    });
};


exports.getByName = function (name, done) {
    Collection.findOne({"name": name, isDeleted: false}, function (err, street) {
        if (err) done(errorBuilder(err));
        done({operationResult: 0, result: street});
    })
};


exports.getAll = function (done) {
    Collection.find({isDeleted: false}, null, {sort: {name: 1}}, function (err, res) { //,
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: res});
    });
};




