//connection of db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to mongo!');
});

exports.ObjectId = mongoose.Types.ObjectId;
//models
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  name:  String,
  seconds: Number,
  date: { type: Date, default: Date.now }
})

exports.Task = mongoose.model('Task', taskSchema);