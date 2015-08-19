require('odata-server');
require('./model');


	var config = {
		type: colleges,
		responseLimit: 10000,
		database: 'BillingController',
		provider: {
			server: '192.168.66.27:27017',
			databaseName: 'BillingController',
			user: '',
			username: '',
			password: ''
		}
	};

	$data.createODataServer(config, '/odata', process.env.PORT || 5000);
