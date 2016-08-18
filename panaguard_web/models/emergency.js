var mongoose = require('mongoose');

var emergencySchema = mongoose.Schema({
	dispatcher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	user: String, //uuid
	medinfo: Object,
	position: Object,
	emergencyType: String,
	timeStart: Date,
	timeEnd: Date,
	canceled: Date
});


module.exports = mongoose.model('Emergency', emergencySchema);