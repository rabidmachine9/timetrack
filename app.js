
/**
 * Module dependencies.
 */
 
var db = require('./db/db.js');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app)




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index );

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require("socket.io").listen(server);

io.sockets.on('connection', function (socket){
  //this is runing when start button is pressed
  socket.on('updateTaskTime', function(data){
  	db.Task.update({_id: data._id}, {$set: { seconds: data.seconds }}, {upsert: true}, function(err){})
  	console.log(data);
  })
  //creating a new task
  socket.on('newTask', function (data){
  	var task = new db.Task({_id: db.ObjectId(data._id), name: data.name, seconds: 0}); 
  	task.save(function(err, task){
  		if(err)
  			console.log('error while saving task');
  		console.log('new task saved');
  	})
  });
  //deleting a task
  socket.on('deleteTask', function (data){
  	db.Task.find({_id: data._id}).remove(function(err, task){
  		if(err) console.log('Could not delete task with id', + task._id);
  		console.log('db.Task deleted');
  	})
  });
  //save task new name
  socket.on('saveTaskName', function(data){
  	db.Task.update({_id: data._id}, {$set:{name: data.name}}, {upsert: true}, function(err){})
  });
  //reseting timer
  socket.on('resetTimer', function (data){
    db.Task.update({_id: data._id}, {$set:{seconds: 0}}, {upsert: true}, function(err){})
  })
});