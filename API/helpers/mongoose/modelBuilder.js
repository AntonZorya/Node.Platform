
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schemes={};

module.exports = function(name, definition, isGetScheme){
	if(!schemes[name]) schemes[name] = new Schema(definition);
	if(isGetScheme)
		return schemes[name];	
	return mongoose.model(name, schemes[name]);
}
