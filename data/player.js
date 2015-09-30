self.port.on('cue-video', function(text) {
  console.log(text);
  window.postMessage({"videoId": text}, '*');
});