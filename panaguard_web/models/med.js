var mongoose = require('mongoose');

var medSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	date: {
		type: Date
	},
	weight: {
		type: Number
	},
	height: {
		type: Number
	},
	notes: {
		type: String
	},
	conditions: {
		type: Array
	}
});

medSchema.statics.findAndUpdateOrCreate = function(req, res) { 

	var update = {
        user: req.user._id,
	    firstName: req.body.firstName,
	    lastName: req.body.lastName,
	    date: req.body.date,
	    weight: req.body.weight,
	    height: req.body.height,
	    notes: req.body.notes,
	    conditions: req.body.conditions
    }

    this.findOne({user: req.user._id}, function(err, med){
        if(err){
            throw new Error(err);
        } else if(!med){
            var med = new this(update).save(function(error, med){
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
            med.update({}, update, function(error){
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

module.exports = mongoose.model('Med', medSchema);