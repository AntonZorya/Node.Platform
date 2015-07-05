var FacilityRepo = require("../../dataLayer/repositories/facility/facilityRepo");

exports.add = function (facility, done) {
    FacilityRepo.getByName(facility.name, facility.organizationId, function (res) {
        if (res.result == null)
            FacilityRepo.add(facility, function (res) {
                done(res);
            });
        else
            return done({operationResult: 1, result: "#facility with same name exist"});
    });
}

exports.update = function (facility, done) {
    FacilityRepo.update(facility, function (res) {
        return done(res);
    });
}

exports.delete = function(id, done) {
    FacilityRepo.delete(id, function (res) {
        return done(res);
    });
};

exports.get = function (id, done) {
    FacilityRepo.get(id, function (res) {
        return done(res);
    });
}


exports.search = function (organizationId, facilityTypeId, term, done){
    FacilityRepo.search(organizationId, facilityTypeId, term, function (res) {
        return done(res);
    });
}