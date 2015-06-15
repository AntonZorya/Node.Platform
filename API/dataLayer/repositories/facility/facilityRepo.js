var FacilityDef = new require("../../models/facility/facility");
var Collection = new require('../../../helpers/mongoose/modelBuilder')('Facility', FacilityDef);

exports.add = function (facility, done) {
    var model = Collection(facility);
    model.save(function (err) {
        if (err) return done(errorBuilder(err));
        return done({ operationResult: 0, result: model });
    });
}

exports.update = function (facility, done) {
    if (facility._id) {
        Collection.findOneAndUpdate({ _id: facility._id }, facility, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0, result: facility});
        });
    }
    else {
        return done({ operationResult: 1, result: "#facilitynotfound" });
    }
}


exports.delete = function (id, done) {
    if (id) {
        Collection.findOneAndUpdate({ _id: id }, { isDeleted: true }, function (err) {
            if (err) return done(errorBuilder(err));
            return done({operationResult: 0});
        });
    } 
}

exports.get = function (id, done) {
    Collection.findById(id)
    .populate("organizationId")
    .populate("facilityTypeId")
    .exec(function (err, data) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: data});
    });
}

exports.getByOragnizationId = function (organizationId, done) {
    Collection.find({ organizationId: organizationId, isDeleted: true })
    .populate("organizationId")
    .populate("facilityTypeId")
    .exec(function (err, data) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: data});
    });
}

exports.search = function (organizationId, facilityTypeId, term, done)
{
    var queries = [];
    if (organizationId)
        queries.push({ "organizationId": organizationId });
    if (facilityTypeId)
        queries.push({facilityTypeId: facilityTypeId});
    if (term) {
        queries.push({ name: new RegExp("/^" + term + "$/i") });
    }
    Collection.find({ $and: queries })
    .populate("organizationId")
    .populate("facilityTypeId")
    .exec(function (err, data) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: data});
    });
}

exports.getByName = function (name, organizationId, done) {
    Collection.findOne({ name: name, organizationId: organizationId }, function (err, data) {
        if (err) return done(errorBuilder(err));
        return done({operationResult: 0, result: data});
    });
};