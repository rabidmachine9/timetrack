
/*
 * GET home page.
 */

var db = require('../db/db.js');

exports.index = function(req, res){
	db.Task.find({}, function(err, tasks){
		var tasksObj = {};
		tasks.forEach(function(task){
			tasksObj[task._id] = task;
		})
		console.log('The tasks',tasks);
  	res.render('index', { title: 'Express',tasks: tasksObj });
	});
};