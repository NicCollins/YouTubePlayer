//Load video list and current position from session storage
var videoIds = JSON.parse(sessionStorage.getItem("videoIds")) || [];
var currentVideoPosition = JSON.parse(sessionStorage.getItem("currentVideoPosition")) || 0;
var videoPage = JSON.parse(sessionStorage.getItem("videoPage")) || false;

//Listeners from contect menu actions
self.port.on('cue-video', function(text) {
	cueVideo(text);
});

self.port.on('clear-video', function() {
	clearPlaylist();
});

self.port.on('restart-video', function() {
	restartPlaylist();
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
if (videoIds.length > 0 && videoPage) {
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
	if (!videoPage) {
		updateUrl();
	}
}

function clearPlaylist() {
	videoIds = [];
	currentVideoPosition = 0;
	sessionStorage.setItem("videoIds", JSON.stringify(videoIds));
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	resetUrl();
}

function playVideo() {
	player.play();
}

function pauseVideo() {
	player.pause();
}

function nextVideo() {
	if (currentVideoPosition < videoIds.length) {
		currentVideoPosition++;
		console.log('Jumping to next');
		updateUrl();
	} else {
		console.log('Reached end of list');
		resetUrl();
		self.port.emit("playlist-alert", "You've reached the end of the playlist. Please add more videos or return to the beginning of the list");
	}
}

function previousVideo() {
	currentVideoPosition--;

	if (currentVideoPosition >= 0) {
		console.log('Jumping to previous');
		updateUrl();
	} else {
		currentVideoPosition = 0;
		console.log('Reached begining of list');
		self.port.emit("playlist-alert", "You've reached the beginning of the playlist");
	}
}

function restartPlaylist() {
	currentVideoPosition = 0;
	console.log('Restarting playlist');
	updateUrl();
}

//Function to update the panel state and update position variable
function updateUrl() {
	console.log('Video loaded: ' + videoIds[currentVideoPosition]);
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	videoPage = true;
	sessionStorage.setItem("videoPage", JSON.stringify(videoPage));
	window.location.href = 'http://www.youtube.com/watch?v=' + videoIds[currentVideoPosition];
}

function resetUrl() {
	videoPage = false;
	sessionStorage.setItem("videoPage", JSON.stringify(videoPage));
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	window.location.href = 'http://www.youtube.com';
}