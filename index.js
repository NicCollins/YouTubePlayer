//Load needed SDK components
var { ToggleButton } = require('sdk/ui/button/toggle');
var contextMenu = require("sdk/context-menu");
var panels = require("sdk/panel");
var self = require("sdk/self");
var notifications = require("sdk/notifications");

//Setup toggle to attach panel to
var button = ToggleButton({
  id: "my-button",
  label: "YouTube Player",
  icon: {
    "16": "./YouTube.gif"
  },
  onChange: handleChange
});

//Create the panel in it's initial state
var panel = panels.Panel({
  width: 512,
  height: 320,
  contentURL: 'http://www.youtube.com/',
  contentScriptFile: './player.js',
  onHide: handleHide
});

//Setup context menu item to get videos
var menuItem = contextMenu.Item({
  label: "Add Video",
  context: contextMenu.SelectorContext("a[href*='/watch?']"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(node.href);' +
                 '});',
  onMessage: function (imgSrc) {
    console.log(imgSrc);
	reg = /youtube.com/;
	if (reg.test(imgSrc)) {
		var videoId = imgSrc.split('=')[1];
		console.log(videoId);
		panel.port.emit('cue-video', videoId);
	}
  }
});

//Setup context menu for player controls
var menu = contextMenu.Menu({
  label: "Player Controls",
  contentScript: 'self.on("click", function (node, data) {' +
                 '  console.log("You clicked " + data);' +
				 '  self.postMessage(data);' +
                 '});',
  items: [
    contextMenu.Item({ label: "Play", data: "play" }),
	contextMenu.Item({ label: "Pause", data: "pause" }),
    contextMenu.Item({ label: "Next Video", data: "next" }),
    contextMenu.Item({ label: "Previous Video", data: "previous" }),
	contextMenu.Item({ label: "Restart Playlist", data: "restart" }),
	contextMenu.Item({ label: "Clear", data: "clear" }),
  ],
  onMessage: function (command) {
	panel.port.emit(command + '-video');
  }
});

//Panel functions to control show and hide
function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

//Port listeners
panel.port.on('playlist-alert', function(text) {
	notifications.notify({
		title: 'Youtube Player',
		text: text
	});
});