'use strict';

const express = require('express');
const app = express();
const host = '127.0.0.1';
const dgram = require('dgram');
const service = require('./facade');
let server = dgram.createSocket('udp4');

app.get('/logs', function (req, res) {
  return service.log.find(req.query)
    .then((response) => {
      res.send(response);
    });
});

app.get('/stats', function (req, res) {
  return service.log.stats()
    .then((response) => {
      res.send(response);
    });
});

module.exports = {
  start,
  stop
};

function start(syslogPort, restPort, callback) {

  server.on('listening', function () {
    var address = server.address();
    console.log(`Syslog server is listening on ${address.address}:${address.port}`);
  });

  server.on('message', function (message, remote) {
    let log = `${remote.address}:${remote.port}-${message}`;
    let payload = { ip: remote.address, message: `${message}` };
    service.log.save(payload);
  });

  server.bind(syslogPort, host);

  return app.listen(restPort, callback);
}

function stop() {

}