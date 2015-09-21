require('./institution');

$data.EntityContext.extend("colleges", {
	"_ClientPopulatedAndAggregated": {type: $data.EntitySet, elementType: colleges._ClientPopulatedAndAggregated}
});

module.exports = exports = colleges;