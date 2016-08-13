var mongoose = require('mongoose');

function randomCode() {
  var min = 1000;
  var max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var userSchema = mongoose.Schema({
    username: {
        type: String, //THIS IS A PHONE NUMBER
        required: true
    },
  	password: {
        type: String,
        required: true
    },
    medical: { //necessary?
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medical'
    },
    registrationCode: {
        type: String
    },
    contacts: { //necessary?
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contacts'
    }

});

module.exports = mongoose.model('User', userSchema);
