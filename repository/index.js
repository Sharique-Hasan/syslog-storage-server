'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename: 'logdb.json', autoload: true });
const async = require('async');
const _ = require('lodash');

module.exports = {
  save,
  find,
  stats
};

function save(payload, callback) {
  return db.insert(payload, callback);
}

function find(payload, callback) {
  let criteria = _.pick(payload, ['cat', 'event', 'action', 'ip']);
  let limit = +payload.num || 20;
  let sort = { createdAt: -1 };
  if (payload.startTime) {
    criteria.time = { $gte: payload.startTime }
  }
  if (payload.endTime) {
    criteria.time = criteria.time || {};
    criteria.time['$lte'] = payload.endTime;
  }

  return db.find(criteria).sort(sort).projection({
    time: 1, ip: 1, cat: 1, event: 1, action: 1, message: 1, _id: 0
  }).skip(0).limit(limit).exec(callback);
}

function stats(callback) {
  let executions = [
    // successfully received logs
    (callback) => {
      db.count({malformed: { $exists: false }}, callback);
    },
    // malformed received logs
    (callback) => {
      db.count({malformed: { $exists: true }}, callback);
    },
    // first received log
    (callback) => {
      db.findOne({}, { time: 1 }, callback);
    }
  ];

  async.parallel(executions, (err, response) => {
    let result = {
      received: response[0],
      malformed: response[1]
    };
    if(response[2]) {
      result.first = response[2].time;
    }
    // last received log
    db.find({}, { time: 1 }).skip(result.received - 1).limit(1).exec((err, response) => {
      if(response[0]) {
        result.last = response[0].time;
      }
      return callback(result);
    });
  });

}