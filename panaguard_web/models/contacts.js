var mongoose = require('mongoose');

var contactsSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId
	},
	name: {
		type: String, 
		required: true
    },
  	phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});

contactsSchema.statics.findAndUpdateOrCreate = function(req, res) { 

	var update = {
        user: req.user._id,
	    name: req.body.name,
	    phone: req.body.phone,
	    email: req.body.email
    }

    this.findOne({user: req.user._id}, function(err, contacts){
        if(err){
            throw new Error(err);
        } else if(!contacts){
            var contacts = new this(update).save(function(error, contacts){
                if(error){
                    res.status(400).json({
					  	success: false,
					  	error: error
					})
                } else {
                    res.json({
                		success: true
              		});
                }
            });
        } else {
            contacts.update({}, update, function(error){
            	if(error){
                    res.status(400).json({
					  	success: false,
					  	error: error
					})
                } else {
                    res.json({
                		success: true
              		});
                }
            });
        }
    }.bind(this));
};

module.exports = mongoose.model('Contacts', contactsSchema);