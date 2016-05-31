'use strict';

const helpers = require('../helpers');
const repos = require('../repository');
const _ = require('lodash');
const moment = require('moment');
let logs = [];

module.exports = {
  save,
  find,
  stats
};

setInterval(() => {
  let documents = _.clone(logs);
  logs = [];
  if(!_.isEmpty(documents)){
    repos.save(documents);
  }
}, 5000);

function save(payload) {
  payload = _.extend(payload, { createdAt: moment().valueOf() });
  return helpers.parser.parseLog(payload)
    .then((log) => {
      logs.push(log);
    });
}

function find(params) {
  return new Promise((resolve) => {
    let caseInsensitive = ['cat', 'event', 'action'];
    params = _.mapValues(params, (el, key) => {
      if(_.includes(caseInsensitive, key)) {
        return new RegExp(el, 'i');
      }
      return el;
    });
    repos.find(params, (err, response) => {
      return resolve(response);
    });
  });
}

function stats() {
  return new Promise((resolve) => {
    repos.stats((response) => {
      return resolve(response);
    });
  });
}