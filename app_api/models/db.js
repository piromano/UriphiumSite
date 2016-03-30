
var mongoose = require( 'mongoose' );
var dbURI = 'mongodb://192.168.99.100:32768/Uriphium';
if (process.env.NODE_ENV === 'production') {
  dbURI = 'mongodb://heroku_app20110907:4rqhlidfdqq6vgdi06c15jrlpf@ds033669.mongolab.com:33669/heroku_app20110907';
}

mongoose.connect(dbURI);


var dbURIlog = 'mongodb://192.168.99.100:32768/UriphiumLog';
var logDB = mongoose.createConnection(dbURIlog);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});
// BRING IN YOUR SCHEMAS & MODELS
require('./locations');
require('./users');