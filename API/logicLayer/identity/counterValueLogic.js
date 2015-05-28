var CounterValueRepo = require('../../dataLayer/repositories/identity/counterValueRepo');

exports.add = function(counterValue, done) {

	CounterValueRepo.add(counterValue, function(data) {
		done(data);
	});
};