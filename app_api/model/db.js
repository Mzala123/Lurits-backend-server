const mongoose = require('mongoose')
const dbURL = process.env.dbURL
mongoose.connect(dbURL)

mongoose.connection.on('connection', function(){
    console.log('mongoose connected to ' +dbURL);
 });
 
mongoose.connection.on('error', function(err){
     console.log('mongoose connection error ' +err);
  });

mongoose.connection.on('disconnected', function(){
     console.log('mongoose disconnected');
  });

  gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through "+msg);
        callback();
    });
};

process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
    });
 
});


process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
    process.exit(0);
    });
});

process.on('SIGINT', function(){
    gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
    });
});

require('./institution')
require('./user')
require('./person')
require('./classDetails')
require('./attendance')