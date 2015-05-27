
exports.definition =  { 
	userName: {type: String, required: "UserName required"},//getTvjy franslation("UserName required")},
	password: {type: String, required: true},
	rememberMe: {type: Boolean, reuqired: false}
};

exports.validators = [{name: "userName", validator: function(value){
	return value!="0";
}, err: "не могу 0"}
];


