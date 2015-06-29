FacilityTypeRepo = require("../../dataLayer/repositories/facility/facilityTypeRepo");
var async = require("async");

exports.add = function (facilityType, done) {
    FacilityTypeRepo.getByName(facilityType.name, function (res) {
        if (res.result == null)
            FacilityTypeRepo.add(facilityType, function (data) {
                return done(data);
            });
        else
            return done({ operationResult: 1, result: "#facilityType with same name exist" });
    });
}

exports.update = function (facilityType, done) {
    FacilityTypeRepo.update(facilityType, function (data) {
        return done(data);
    });
}

exports.getAll = function (done) {
    FacilityTypeRepo.getAll(function (data) {
        return done(data);
    });
}

exports.delete = function (id, done) {
    FacilityTypeRepo.delete(id, function (data) {
        return done(data);
    });
}

exports.get = function (id, done) {
    FacilityTypeRepo.get(id, function (data) {
        return done(data);
    });
}

exports.getByOrganizationId = function (organizationId, done) {
    FacilityTypeRepo.getByOrganizationId(organizationId, function (data) {
        done(data);
    });
}