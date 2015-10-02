//Load video list and current position from session storage
var videoIds = JSON.parse(sessionStorage.getItem("videoIds")) || [];
var currentVideoPosition = JSON.parse(sessionStorage.getItem("currentVideoPosition")) || 0;


//Listeners from contect menu actions
self.port.on('cue-video', function(text) {
	cueVideo(text);
});

self.port.on('clear-video', function() {
	clearPlaylist();
});

self.port.on('play-video', function() {
	playVideo();
});

self.port.on('pause-video', function() {
	pauseVideo();
});

self.port.on('next-video', function() {
	nextVideo();
});

self.port.on('previous-video', function() {
	previousVideo();
});

//Get player from the DOM and add event listener
if (videoIds.length > 0) {
	var player = document.getElementsByClassName('html5-main-video')[0]

	if (player) {
		player.addEventListener('ended',myHandler,false);
	} else {
		nextVideo();
	}
}

//Event listener action
function myHandler(e) {
	console.log('Video ended');
	nextVideo();
}

//Functions for video interaction from context menu
function cueVideo(videoId) {
	console.log('VideoId added: ' + videoId);
	videoIds.push(videoId);
	sessionStorage.setItem("videoIds", JSON.stringify(videoIds));
	console.log('VideoId array: ' + videoIds);
	if (videoIds.length == 1) {
		updateUrl();
	}
}

function clearPlaylist() {
	videoIds = [];
	currentVideoPosition = 0;
	sessionStorage.setItem("videoIds", JSON.stringify(videoIds));
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	
	window.location.href = 'http://www.youtube.com';
}

function playVideo() {
	player.play();
}

function pauseVideo() {
	player.pause();
}

function nextVideo() {
	currentVideoPosition++;
	if (currentVideoPosition < videoIds.length) {
		console.log('Jumping to next');
		updateUrl();
	} else {
		console.log('Reached end of list');
	}
}

function previousVideo() {
	currentVideoPosition--;
	if (currentVideoPosition > 0) {
		console.log('Jumping to previous');
		updateUrl();
	} else {
		console.log('Reached begining of list');
	}
}

//Function to update the panel state and update position variable
function updateUrl() {
	console.log('Video loaded: ' + videoIds[currentVideoPosition]);
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	window.location.href = 'http://www.youtube.com/watch?v=' + videoIds[currentVideoPosition];
}