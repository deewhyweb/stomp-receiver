'use strict';
var client = null;
var Stomp = require('stomp-client');
const amq_host = process.env['amq_host']? process.env['amq_host'] :'messaging-wss-e960xjutbe-openshift-enmasse.e785.tke-2.openshiftapps.com';
const amq_port = process.env['amq_port']? process.env['amq_port'] : 443 
const username = process.env['username']? process.env['amq_host'] :'artemis';
const password = process.env['password']? process.env['password'] : 'simetraehcapa'


function AMQService() {}

AMQService.prototype.init = function(cb) {
  console.log('AMQ service init called');
  var self = this;
  if (client === null) {
   
    console.log('Start to initialise AMQService');
    client = new Stomp(amq_host, amq_port, username, password,"1.0", null, {});
    
    client.connect(function(/* sessionId */) {
        console.log('Connected to: %s : %s', amq_host, amq_port);
        cb();
      },
      function(err) {
        console.log(err, 'Failed to initialise AMQService', arguments);
        return cb(err);
      });

    client.on('error', function(e) {
        console.log(e, 'AMQService error: ', arguments);
    });
    client.on('connect', function() {
        console.log('AMQService has connected');
    });

    client.on('disconnect', function() {
        console.log('AMQService has disconnected');
    });
  } else if (client && starting === true){
    // do nothing, still connecting
    console.log('AMQService trying to connect.');
  } else {
    console.log('AMQService has been initialised.');
    cb();
  }
};


/**
 * Subscribe to a queue
 * @param  {String} queueName
 * @return {Boolean}
 */
AMQService.prototype.subscribe = function(queueName, cb) {
  if (client) {
    console.log('Begin subscribe to queues: %s', queueName);
    client.subscribe(queueName, function(body, headers) {
      console.log('Subscribe finished: %s', queueName);
      console.log('Subscribe Body:', body);
      console.log('Subscribe Headers:', headers);
      cb(body, headers);
    });
    return true;
  } else {
    console.log('Tried to connect queue without initialising stomp client.');
    return false;
  }
};


module.exports = new AMQService();
