var FacilityLogic = require("../../logicLayer/facility/facilityLogic");


module.exports = function (router) {
    router.route("/facility/add")
    .post(function (req, res) {
        FacilityLogic.add(req.body, function (data) {
            res.json(data);
        });
    });

    router.route("/facility/update")
    .post(function (req, res) {
        FacilityLogic.update(req.body, function (data) {
            res.json(data);
        });
    });

    router.route("/facility")
    .delete(function (req, res) {
        FacilityLogic.delete(req.params.id, function (data) {
            res.json(data);
        });
    });

    router.route("/facility")
    .get(function (req, res) {
        FacilityLogic.get(req.query.id, function (data) {
            res.json(data);
        });
    });

    router.route("/facilities")
    .get(function (req, res) {
        FacilityLogic.search(req.query.organizationId, req.query.facilityTypeId, req.query.term, function (data) {
            res.json(data);
        });
    });


}