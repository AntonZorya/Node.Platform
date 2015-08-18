require('./institution');

$data.EntityContext.extend("colleges", {
	"_ClientJoinedAndAggregated": {type: $data.EntitySet, elementType: colleges._ClientJoinedAndAggregated}
});

module.exports = exports = colleges;