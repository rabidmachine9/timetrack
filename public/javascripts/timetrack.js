$(document).ready(function(){
	var socket = io.connect();
	//a template
	var taskTemplate = $('#task-template').html();
	//instases of StopWatch will be stored in an array
	var stopWatch = [];
	//on load apply to all elements-tasks
	$('.task').each(function(){
		var hash = $(this).closest('.task').data("taskid");
		var timerId ='#timer_'+hash;
		var seconds = $(timerId).text();
		stopWatch[hash] = new StopWatch(seconds, socket);
		var formatedTime = stopWatch[hash].convertSeconds(seconds);
		$(timerId).text(formatedTime);
	});

	//new task button
	$('.new-task').click(function(){
		var hash = uniqueHash(24);
		var timerId ='timer_'+hash;
		var formatedTemplate = taskTemplate.templateFormat(hash);
		$('#tasks').append(formatedTemplate);
		stopWatch[hash] = new StopWatch(0, socket);
		socket.emit('newTask', {_id : hash, name: 'task'});
	})

	//start button
	$('#tasks').on('click','.btn-success',function(){
		var taskId = $(this).closest('.task').data("taskid");
		console.log(taskId);
		var timerId = "timer_"+taskId;
		$(this).addClass('btn-danger');
		$(this).removeClass('btn-success');
		$(this).text('stop');
		stopWatch[taskId].start(taskId);
		
	});

	//pause button
	$('#tasks').on('click','.btn-danger',function(){
		var taskId = $(this).closest('.task').data("taskid");
		console.log(taskId);
		$(this).addClass('btn-success');
		$(this).removeClass('btn-danger');
		$(this).text('start');
		stopWatch[taskId].pause(taskId);
	});

	//reset button
	$('#tasks').on('click', '.reset-button', function(){
		var taskId = $(this).closest('.task').data("taskid");
		stopWatch[taskId].reset(taskId);
		socket.emit('resetTimer',{_id : taskId});
	});

	//remove task
	$("#tasks").on('click','.delete-button', function(){
		var taskId = $(this).closest('.task').data("taskid");
		 $(this).closest('.task-container').remove();
		socket.emit('deleteTask',{_id : taskId});
	});

	//change task name
	$('.name').focusout(function(){
		var taskName = $(this).text();
		var taskId = $(this).closest('.task').data("taskid");
		socket.emit('saveTaskName',{_id : taskId, name : taskName});
	});
	
})