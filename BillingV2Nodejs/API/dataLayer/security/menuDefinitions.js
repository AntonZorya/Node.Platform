/// <reference path="roleDefinitions.js" />
var roleDefinitions = require("./roleDefinitions");

module.exports = [
    {
        url: '/main',
        name: 'Главная',
        childs: [],
        roles: null,
        iconClass: "icon home"
    },
    {
        url: "/reports",
        name: 'Отчеты',
        iconClass: "star icon",
        loadFirstChild: true,
        childs: [
            {
                url: "/reports/report1",
                name: 'Отчет по контролерам',
                childs: [],
                roles: null
            },
            {
                url: "/reports/report2",
                name: 'Отчет по водопотреблению',
                childs: [],
                roles: null
            },
            {
                url: "/reports/report3",
                name: 'Обновить данные для ODATA',
                childs: [],
                roles: null
            }
        ],
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin]
    },
    {
        url: "/administration/translate",
        name: "Администрирование",
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin],
        iconClass: "configure icon",
        childs: [
            {
                url: "/multilanguage",
                name: "Мультиязычность",
                roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin],
                iconClass: "translate icon",
                loadFirstChild: true,
                childs: [{
                    url: "/administration/translate",
                    name: "Переводы",
                    roles: null,
                    childs: []
                },
                    {
                        url: "/administration/languages",
                        name: "Языки",
                        roles: null,
                        childs: []
                    }]

            },
            {
                url: "/administration/users",
                name: "Пользователи",
                roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin],
                iconClass: "users icon",
                childs: []
            }
        ]
    },
    {
        url: "/operator/juridical",
        name: "Юр. оператор",
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin, roleDefinitions.operatorJuridical],
        childs: [ ]
    },
    {
        url: "/operator/fizical",
        name: "Физ. оператор",
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin, roleDefinitions.operatorFizical],
        childs: []
    },
    {
        url: "/operator/juridical/paymentsByPeriod",
        name: "Баланс",
        roles: null,
        childs: []
    }
];