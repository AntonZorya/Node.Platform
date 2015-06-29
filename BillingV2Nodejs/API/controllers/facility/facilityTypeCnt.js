var Logic = require("../../logicLayer/facility/facilityTypeLogic");

module.exports = function (router) {
    router.route("/facility/facilitytype/add")
    .post(function (req, res) {
        Logic.add(req.body, function (data) {
            res.json(data);
        });
    });


    router.route("/facility/facilitytype/update")
    .post(function (req, res) {
        Logic.update(req.body, function (data) {
            res.json(data);
        });
    });


    router.route("/facility/facilitytype/getall")
    .get(function (req, res) {
        Logic.getAll( function (data) {
            res.json(data);
        });
    });
    
    router.route("/facility/facilitytype")
    .delete(function (req, res) {
        Logic.delete(req.params.id, function (data) {
            res.json(data);
        });
    });

    router.route("/facility/facilitytype/get")
    .get(function (req, res) {
        Logic.get(req.query.id, function (data) {
            res.json(data);
        });
    });

    router.route("/facility/facilitytype/getbyorgid")
    .get(function (req, res) {
        Logic.getByOrganizationId(req.params.orgid, function (data) {
            res.json(data);
        });
    });
}