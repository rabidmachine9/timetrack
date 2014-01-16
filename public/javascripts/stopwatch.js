function StopWatch(sec, socket){
	this.socket = socket;
	this.totalSec = sec;
	this.id= [];
}

/*
 *input: number, seconds counted
 *return: string, seconds formated in hours,minutes and seconds
 */

StopWatch.prototype.convertSeconds = function(seconds){
	this.totalSec = seconds;
	var hours = parseInt( this.totalSec / 3600 ) % 24;
	var minutes = parseInt( this.totalSec / 60 ) % 60;
	var seconds = this.totalSec % 60;

	var formatedTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	return formatedTime;
}

/*
 *starting the timer, every second stores in db
 *
 */
StopWatch.prototype.start = function(taskId){
	var self = this;
	this.id[taskId] = setInterval(function(){
		console.log(taskId);
		var formatedTime = self.convertSeconds(++self.totalSec);
		var timerId = "timer_"+taskId;
		document.getElementById(timerId).innerHTML = formatedTime;
		self.socket.emit('updateTaskTime',  {_id : taskId ,seconds : self.totalSec});
	},1000);
}
//pausing the timer
StopWatch.prototype.pause = function(taskId){
	clearInterval(this.id[taskId]);
}

//reseting seconds to 0 and storing to db
StopWatch.prototype.reset = function(taskId){
	clearInterval(this.id[taskId]);
	this.totalSec = 0;
	this.socket.emit('task',  {_id : taskId ,seconds : this.totalSec});
	var timerId = "timer_"+taskId;
	document.getElementById(timerId).innerHTML = this.convertSeconds(0);
}