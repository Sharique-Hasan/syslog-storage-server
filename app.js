'use strict';

//Command line params
const argv = require('optimist').argv;
const sysLogPort = +argv.s;
const restAppPort = +argv.r;

//Bootstrapping syslog server
const sysLogServer = require('./syslogserver');

//DB connection
require('./repository');

if(!sysLogPort || !restAppPort){
  throw new Error('Syslog port or REST app port is missing');
}

sysLogServer.start(sysLogPort, restAppPort, () => {
  console.log('REST API app is up and running');
});
