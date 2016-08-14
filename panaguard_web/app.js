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

//right(start)

var url = require('url')
  , WebSocketServer = WebSocket.Server
  , wss = new WebSocketServer({ port: 8080 })
 
// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });
 
wss.on('connection', function connection(ws) {
  console.log('User connected!');
  console.log('total users: ', wss.clients.length);
  //console.log('connection established. clients: ', wss.clients[0].blah);
  var location = url.parse(ws.upgradeReq.url, true);
  //console.log('location: ',location)
  // you might use location.query.access_token to authenticate or share sessions 
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    
  });

  // ws.on('room', function )

  
 
});
 
// server.on('request', app);
// server.listen(port, function () { console.log('Listening on ' + server.address().port) });


//right(end)

//==============================
//    (end) Websockets
//==============================

//use routes

app.get('/', function(req, res) {
  res.render('index');
});

//app.use('/dispatch', dispatch);
app.use('/auth', auth);
app.use('/api', routes);

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
