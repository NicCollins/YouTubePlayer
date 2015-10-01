var { ToggleButton } = require('sdk/ui/button/toggle');
var contextMenu = require("sdk/context-menu");
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
  id: "my-button",
  label: "YouTube Player",
  icon: {
    "16": "./YouTube.gif"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  width: 512,
  height: 320,
  contentURL: 'http://www.youtube.com/',
  contentScriptFile: './player.js',
  onHide: handleHide
});

var menuItem = contextMenu.Item({
  label: "Add Video",
  context: contextMenu.SelectorContext("a[href]"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(node.href);' +
                 '});',
  onMessage: function (imgSrc) {
    console.log(imgSrc);
	var videoId = imgSrc.split('=')[1];
	console.log(videoId);
	panel.port.emit('cue-video', videoId);
  }
});

var menu = contextMenu.Menu({
  label: "Player Controls",
  contentScript: 'self.on("click", function (node, data) {' +
                 '  console.log("You clicked " + data);' +
				 '  self.postMessage(data);' +
                 '});',
  items: [
    contextMenu.Item({ label: "Next Video", data: "next" }),
    contextMenu.Item({ label: "Previous Video", data: "previous" })
  ],
  onMessage: function (command) {
	panel.port.emit(command + '-video');
  }
});

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