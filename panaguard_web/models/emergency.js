var mongoose = require('mongoose');

var emergencySchema = mongoose.Schema({
	dispatcher: {
		type: mongoose.Schema.Types.ObjectId
	},
	user: String, //uuid
	medinfo: Object,
	latitude: String,
	longitude: String,
	emergencyType: String
});


module.exports = mongoose.model('Emergency', emergencySchema);