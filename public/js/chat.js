var socket = io();

function scrollToBottom(){
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();
	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}
}
	socket.on('connect', function(){
		

		
	});
	socket.on('disconnect',function(){
		console.log('disconnected from server');
	});

	socket.on('newMessage',function(message){
		var formattedTime = moment(message.createdAt).format('h:mm a');
		var template = jQuery('#message-template').html();
		var html = Mustache.render(template,{
			text: message.text,
			from: message.from,
			createdAt: formattedTime
		});
		jQuery('#messages').append(html);
		scrollToBottom();
	});

	// socket.emit('createMessage',{
	// 	from: 'raghav',
	// 	text: 'hi'
	// }, function(data){
	// 	console.log('Got it', data);
	// });

	socket.on('newLocationMessage',function(message){
		var formattedTime = moment(message.createdAt).format('h:mm a');
		var template = jQuery('#location-message-template').html();
		var html = Mustache.render(template,{
			from: message.from,
			url: message.url,
			createdAt: formattedTime
		});
		jQuery('#messages').append(html);
		scrollToBottom();
		
	});

	var messageTextbox = jQuery('[name=message]');

	jQuery('#message-form').on('submit',function(e){
		e.preventDefault();

		socket.emit('createMessage',{
			from: 'User',
			text: messageTextbox.val()
		}, function(){
			messageTextbox.val('');
		});
	});

	var locationButton = jQuery('#send-location');
	locationButton.on('click',function(){
		if(!navigator.geolocation){
			return alert('Geolocation not supported by your browser');

		}

		locationButton.attr('disabled','disabled').text('sending location...');
		navigator.geolocation.getCurrentPosition(function(position){
			locationButton.removeAttr('disabled').text('send location');
			socket.emit('createLocationMessage',{
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},function(){
			locationButton.removeAttr('disabled').text('send location');
			alert('unable to fetch location');
		});
	});	












