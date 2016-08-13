var express = require('express'),
    User    = require('../models/user'),
    _       = require('underscore'),
    jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcrypt'),
    router  = express.Router();

router.post('/register', function(req, res, next) {

  if(!req.body.username || ! req.body.password){
    res.status(400).json({
      success: false,
      error: "You must register with a username and a password"
    })
  }

  User.findOne({
    username: req.body.username
  }, function(err, user){
      if (err) throw err;

      if(user) {
        res.status(400).json({
          success: false,
          error: "A user with that username already exists"
        })
      } else {
          var params = _.pick(req.body, ['username', 'password']);
          console.log(params);

          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(params.password, salt, function(err, hash) {
              // Store hash in your password DB.
              console.log(err);
              params.password = hash;
              var c = new User({
                username: params.username,
                password: hash
              }).save(function(err, user) {
                console.log('mongoose ', err);
                if (err) {
                  res.status(400).json({
                    success: false,
                    error: err.message
                  });
                } else {
                  res.json({
                    success: true
                  });
                }
              })
            });
          });
        } 
  });
});

router.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      bcrypt.compare(req.body.password, user.password, function(err, resp){
        console.log('resp: ', resp);
        if(!resp) {
          res.status(400).json({
            success: false,
            error: "Incorrect password"
          })
        } else {
            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, process.env.SECRET);

            // return the information including token as JSON
            console.log('success!');
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
      });
    }
  });
});

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

module.exports = router;
