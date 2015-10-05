var ModelBase = require('../base/modelBase');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var systemRoleScheme = new require(_helpersMongoosePath + 'modelBuilder')('systemRole', require('./systemRole'), true);

exports.definition = _.extend({
    userName: {type: String, required: true},
    userFullName: {type: String},
    password: {type: String, required: true},
    email: {type: String, required: true},
    employee: {type: Schema.Types.ObjectId, ref: 'Employee', required: false},
    roles: [{type: String}],
    organizationId: {type: Schema.Types.ObjectId, ref: 'Organization', required: false},
    controllerId: {type: Schema.Types.ObjectId, ref: 'Controller', required: false},
    sites: [{type: String}]
}, ModelBase);


exports.validators = [
    {
        name: "email", validator: function (email) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    }, err: "#Не правильный email"
    }
];

