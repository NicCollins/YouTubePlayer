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

var menuItem = contextMenu.Item({
  label: "Log Selection",
  context: contextMenu.SelectorContext("a[href]"),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(node.href);' +
                 '});',
  onMessage: function (imgSrc) {
    console.log(imgSrc);
  }
});

var panel = panels.Panel({
  contentURL: 'http://www.youtube.com',
  onHide: handleHide
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