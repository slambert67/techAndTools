function messageHandler(e) {
  postMessage("worker replied: " + e.data + " too");  // actual message in e.data
}

addEventListener("message", messageHandler, true);  // listening to message from main ui thread