var stompClient = require("./receiver");
var inited=false;

function onStompInit(err) {
  if (err) {
    console.error(err);
  } else {
    if (inited === true) {
      console.log('Already subscribed');
    }
    inited = true;
    stompClient.subscribe("test-queue", onMessage);
    console.log('Subscribed');
  }
}

function onMessage(body, headers) {
  console.log("Got message body ", body);
  console.log("Got message headers ", headers);
}

stompClient.init(onStompInit);
