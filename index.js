var stompClient = require("./receiver");
var inited=false;

function onStompInit(err) {
  if (err) {
    console.error(err);
  } else {
    if (inited === true) {
      return cb();
    }
    inited = true;
    stompClient.subscribe("/queue/examples", onMessage);
    cb();
  }
}

function onMessage(body, headers) {
  console.log("Got message body ", body);
  console.log("Got message headers ", headers);
}

stompClient.init(onStompInit);