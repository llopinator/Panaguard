//==============================
//           Packages
//==============================

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
//==============================
//           Routes
//==============================

var routes    = require('./routes/index');
var auth      = require('./routes/auth');
var dispatch  = require('./routes/dispatch');

//==============================
//           Models
//==============================

var User = require('./models/user');
var Emergency = require('./models/emergency');

//==============================
//      View Engine Setup
//==============================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bundle', express.static(path.join(__dirname, 'bundle')));


//==============================
//     Database Connection
//==============================

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

//==============================
//            CORS
//==============================

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//==============================
//          Websockets
//==============================

var url = require('url')
  , WebSocketServer = WebSocket.Server
  , wss = new WebSocketServer({ port: 8080 })

wss.dispatchers = []; //queue of dispatchers awaiting emergency requests

wss.on('connection', function connection(ws) {
  
  var location = url.parse(ws.upgradeReq.url, true);
  
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var msg = JSON.parse(message);

    if(msg.type === "auth") { //user or dispatcher auth

      if(msg.op){ //if dispatcher requesting auth, verify w/ dispatcher secret
        jwt.verify(msg.token, process.env.SECRET, function(err, decoded) {      
          if (err) {
            return ws.close(1003, 'error: ' + err)    
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
            return ws.close(1003, 'error: ' + err)    
          } else if(wss.dispatchers.length === 0) {
            //CHECK IF DISPATCHERS ARRAY EMPTY
            //if dispatchers.length === 0, emit event says "try again" (tell them to send another ack)
            console.log('no dispatchers in queue - telling user to try again');
            ws.send(JSON.stringify({
              type: 'tryAgain',
              token: msg.token
            }));
          } else {
            //what if only one dispatcher on queue and assigned before user gets here?
            console.log('user connection authorized');
            ws.authorizedUser = true;
            ws.uuid = decoded; //store user's uuid on the ws connection for identification
            wss.nextDispatcher(ws);
            ws.send(JSON.stringify({
              type: 'ack'
            }));
          }
        });
      }
    }

    if(msg.type === "emergency" && ws.authorizedUser && ws.currDispatcher){ //user's emergency request
      console.log('dispatcher received medical information!')
      //console.log(ws.uuid);
      var emergencyObject = { //asynchronously store emergency in DB
        dispatcher: ws.currDispatcher.dispatcherToken._id,
        user: ws.uuid.device,
        medinfo: msg.medinfo,
        position: msg.position,
        emergencyType: "", //TEMP
        timeStart: new Date(),
        timeEnd: null,
        canceled: null
      };
      console.log(msg.position);
      var emergency = new Emergency(emergencyObject)
      .save(function(error, emergency){
          if(error){
            console.log('error saving emergency to db: ', error)
          } else {
            console.log('successfully saved emergency to db');
          }
      });
      ws.currDispatcher.currEmergency = emergencyObject; //store medinfo on dispatcher ws connection
      ws.send(JSON.stringify({
        type: 'paired'
      }));
      ws.currDispatcher.send(JSON.stringify({
        type: 'paired',
        emergency: emergencyObject
      }));
    }

    if(msg.type === "resolved" && ws.authorizedUser && ws.currUser){ //emergency resolved by dispatcher
      ws.currEmergency = false; //clear curr emergency
      ws.currUser.send(JSON.stringify({ //tell user emergency resolved
        type: 'resolved'
      }));
      Emergency.findOneAndUpdate({ //resolve emergency in db
        user: ws.currUser.uuid.device
      }, {timeEnd: new Date()}, function(error, emergency){
          if(error){
            console.log('error resolving emergency in db', error)
          } else {
            console.log('successfully resolved emergency in db');
          }
      });
      ws.currUser.close(1000, 'Dispatcher has resolved your emergency'); //close user's connection
      ws.currUser = false; //clear user
      if(!msg.done){
        wss.dispatchers.push(ws); //put dispatcher at end of queue
      }
      console.log('emergency resolved');
      //console.log(wss);
    }
    
    if(msg.type === "cancel" && ws.authorizedUser && ws.currDispatcher){ //user canceling their emergency
      console.log('canceling!!!!!');
      ws.currDispatcher.send(JSON.stringify({
        type: 'canceled'
      }));
      Emergency.findOneAndUpdate({
        user: ws.uuid.device
      }, {canceled: new Date()}, function(error, emergency){
          //console.log(emergency);
          if(error){
            console.log('error canceling emergency in db', error)
          } else {
            console.log('successfully canceled emergency in db');
          }
      });
      ws.close(1000, 'Emergency canceled'); //close user's connection
    }

    if(msg.type === 'canceled' && ws.authorizedUser && ws.currUser){ //dispatcher canceled on
      ws.currEmergency = false; //clear curr emergency
      ws.currUser = false; //clear user
      wss.dispatchers.push(ws); //put dispatcher at end of queue
      console.log('emergency canceled - dispatcher back in queue');
    }

    if(msg.type === 'endConnection' && ws.authorizedUser){ //dispatcher ending shift
      
      //race condition
      var index = wss.dispatchers.indexOf(ws); //remove dispatcher from queue
      if(index !== -1){
        wss.dispatchers.splice(index, 1);
      }

      console.log('dispatcher ended connection');
      console.log(wss.dispatchers);
      ws.close(1000, 'Dispatcher ended connection');
    }

    if(msg.type === 'updatePosition' && ws.authorizedUser && ws.currDispatcher){
      //send dispatcher updated position
      ws.currDispatcher.send(JSON.stringify({
        type: 'updatePosition',
        position: msg.position
      }));
    }

    if(msg.type === 'identifyEmergency' && ws.authorizedUser && ws.currDispatcher){
      //update type of emergency
      ws.currDispatcher.send(JSON.stringify({
        type: 'identifyEmergency',
        emergency: msg.emergency
      }));
    }

  }); //end of ws
}); //end of wss


//assigns next dispatcher to next user
wss.nextDispatcher = (ws) => {
  var dispatcher = wss.dispatchers.shift(); //take next dispatcher off queue
  dispatcher.currUser = ws; //assign dispatcher to user
  ws.currDispatcher = dispatcher; //assign user to dispatcher
}

//==============================
//    (end) Websockets
//==============================

//use routes

//app.use('/dispatch', dispatch);
app.use('/auth', auth);
app.use('/api', routes);

app.get('/*', function(req, res) {
  res.render('index');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Started, listening on port ', port);
});

module.exports = app;
