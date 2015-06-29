
exports.definition =  { 
	userName: {type: String, required: "#userName required"},//getTvjy franslation("UserName required")},
	password: {type: String, required: "#password required"},
	rememberMe: {type: Boolean, reuqired: false}
};

exports.validators = [{name: "userName", validator: function(value){
	return value!="0";
}, err: "не могу 0"}
];


