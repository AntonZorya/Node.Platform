var FacilityTypeDef = new require("../../models/facility/facilityType");
var Collection = new require('../../../helpers/mongoose/modelBuilder')('FacilityType', FacilityTypeDef);

exports.add = function (facilityType, done) {
    var model = Collection(facilityType);
    model.save(function (err) {
        if (err) return done({ operationResult: 1, error: err });
        done({ operationResult: 0, result: facilityType });
    });
};

exports.update = function (facilityType, done) {
    if (facilityType._id) {
        Collection.findOneAndUpdate({ _id: facilityType._id }, facilityType, { upsert: true }, function (err) {
            if (err) return done(errorBuilder(err));
            return done({ operationResult: 0, result: facilityType });
        });
    }
    else
        return done({operationResult: 1, result: "#facilityType not found"});
}

exports.getAll = function (done) {
    Collection.find({ isDeleted: false }, function (err, facilityTypes) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: facilityTypes});
    })
    
}

exports.delete = function (id, done) {
    if (id) {
        Collection.update({ _id: id }, { isDeleted: true }, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    }
}


exports.get = function (id, done) {
    Collection.findOne({ _id: id }, function (err, facilityType) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: facilityType});
    });
}

exports.getByName = function (name, done) {
    Collection.findOne({ name: name }, function (err, facilityType) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: facilityType});
    });
}

