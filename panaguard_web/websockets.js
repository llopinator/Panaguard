var express       = require('express'),
    app           = express(),
    session       = require('express-session'),
    path          = require('path'),
    favicon       = require('serve-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    MongoStore    = require('connect-mongo')(session),
    mongoose      = require('mongoose'),
    jwt           = require('jsonwebtoken'),
    bcrypt        = require('bcrypt'),
    server        = require('http').Server(app),
    WebSocket = require('ws');

var User = require('./models/user');

var url = require('url')
  , WebSocketServer = WebSocket.Server
  , wss = new WebSocketServer({ port: 8080 })
 
// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });

wss.dispatchers = []; //queue of dispatchers awaiting emergency requests
wss.emergencies = {};

wss.on('connection', function connection(ws) {
  // console.log('User connected!');
  // console.log('total users: ', wss.clients.length);
  //console.log('connection established. clients: ', wss.clients[0].blah);
  var location = url.parse(ws.upgradeReq.url, true);
  //console.log('location: ',location)
  // you might use location.query.access_token to authenticate or share sessions 
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var msg = JSON.parse(message);

    if(msg.type === "auth") { //user or dispatcher auth

      if(msg.op){ //if dispatcher requesting auth, verify w/ dispatcher secret
        jwt.verify(msg.token, process.env.SECRET, function(err, decoded) {      
          if (err) {
            return ws.close(401, 'error: ' + err)    
          } else {
            console.log('dispatcher authorized');
            // if good, set connection to dispatcher and ack
            ws.authorizedUser = true;
            ws.dispatcher = true;
            ws.dispatcherToken = decoded; //store dispatcher's JWT on the ws connection for identification
            wss.dispatchers.push(ws); //add dispatcher to queue
            ws.send(JSON.stringify({
              type: 'ack'
            }));
          }
        });
      } else { //not dispatcher (presumably user)
        jwt.verify(msg.token, process.env.USER_SECRET, function(err, decoded) { 
          console.log('verifying user connection');     
          if (err) {
            return ws.close(401, 'error: ' + err)    
          } else {
            //if good, ack and nextDispatcher
            //nextDispatcher
            //put in room w/ user?
            console.log('user connection authorized');
            ws.authorizedUser = true;
            ws.uuid = decoded; //store user's uuid on the ws connection for identification
            ws.send(JSON.stringify({
              type: 'ack'
            }));
          }
        });
      }
    }

    if(msg.type === "emergency" && ws.authorizedUser){ //user's emergency request
      console.log('dispatcher received medical information!')
      //console.log('user\'s med info: ', msg.medinfo)
      //put in room w/ user?
      ws.send(JSON.stringify({
          type: 'paired'
        }));
    }

  }); //end of ws
}); //end of wss


//asynchronously store emergency object in DB
wss.nextDispatcher = (ws) => {
 //assigns next dispatcher to next user

 wss.emergencies[ws] = wss.dispatchers.unshift();
}

