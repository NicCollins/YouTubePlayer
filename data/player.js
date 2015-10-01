var videoIds = JSON.parse(sessionStorage.getItem("videoIds")) || [];
var currentVideoPosition = JSON.parse(sessionStorage.getItem("currentVideoPosition")) || 0;

self.port.on('cue-video', function(text) {
  console.log(text);
  videoIds.push(text);
  console.log(videoIds);
  if (videoIds.length == 1) {
	updateUrl();
  }
});

self.port.on('next-video', function() {
	nextVideo();
});

self.port.on('previous-video', function() {
	previousVideo();
});

if (videoIds.length > 0) {
	var player = document.getElementsByClassName('html5-main-video')[0]

	if (player) {
		player.addEventListener('ended',myHandler,false);
	} else {
		nextVideo();
	}
}

function myHandler(e) {
	console.log('Video ended');
	currentVideoPosition++;
	window.location.href = 'http://www.youtube.com/watch?v=' + videoIds[currentVideoPosition];
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

function updateUrl() {
	console.log('Video loaded: ' + videoIds[currentVideoPosition]);
	sessionStorage.setItem("videoIds", JSON.stringify(videoIds));
	sessionStorage.setItem("currentVideoPosition", JSON.stringify(currentVideoPosition));
	window.location.href = 'http://www.youtube.com/watch?v=' + videoIds[currentVideoPosition];
}