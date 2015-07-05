/// <reference path="roleDefinitions.js" />
var roleDefinitions = require("./roleDefinitions");

module.exports = [
    {
        url: '/main',
        name: 'Главная',
        childs: [
        ],
        roles: null,
        iconClass: "icon home"
    },
    {
        url: "/facilities",
        name: 'Объекты',
        iconClass: "star icon",
        loadFirstChild: true,
        childs: [
            {
                url: "/facilities",
                name: 'Картотека',
                childs: [],
                roles: null
            },
            {
                url: "/facilities/facilitytypes",
                name: 'Типы объектов',
                childs: [],
                roles: null
            }
        ],
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin]
    },
    {
        url: "/admin",
        name: "Администрирование",
        roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin],
        iconClass: "configure icon",
        childs: [
            {
                url: "/multilanguage",
                name: "Мультиязычность",
                roles: [roleDefinitions.admin],
                iconClass: "translate icon",
                loadFirstChild: true,
                childs: [{
                        url: "/admin/translate",
                        name: "Переводы",
                        roles: null,
                        childs: []
                    },
                     {
                        url: "/admin/languages",
                        name: "Языки",
                        roles: null,
                        childs: []
                    }]
        
            },
            {
                url: "/admin/users",
                name: "Пользователи",
                roles: [roleDefinitions.admin, roleDefinitions.organizationAdmin],
                iconClass: "users icon",
                childs: []
            }
        ]
    }
];