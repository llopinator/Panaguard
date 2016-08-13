var express     = require('express'),
    User        = require('../models/user'),
    Med         = require('../models/med'),
    contacts    = require('../models/contacts')
    jwt         = require('jsonwebtoken'),
    router      = express.Router();

// router.get('/', function(req, res) {
//   res.json({ message: 'Welcome to the coolest API on earth!' });
// });

// // route to return all users (GET http://localhost:8080/api/users)
// router.get('/users', function(req, res) {
//   User.find({}, function(err, users) {
//     res.json(users);
//   });
// });

//save medical information
router.post('/medinfo', function(req, res) {
  Med.findAndUpdateOrCreate(req, res);
});

//save emergency contacts
router.post('/contacts', function(req, res) {
  Contacts.findAndUpdateOrCreate(req, res);
});


module.exports = router;
