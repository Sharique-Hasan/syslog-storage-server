'use strict';

module.exports = {
  parseLog
};


function parseLog(payload){
  let log = payload;
  return _pri(log.message)
    .then(_date)
    .then(_category)
    .then(_severity)
    .then(_logId)
    .then(_revision)
    .then(_event)
    .then(_action)
    .catch((err) => {
      return Promise.resolve(err);
    });

  function _pri(message) {
    let regex = /<([0-9]+)>/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'pri' });
    }
    log.pri = +match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _date(message){
    let regex = /\[((19|20)[0-9]{2}[-](0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012]) (2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])]/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'date' });
    }
    log.time = new Date(match[0].replace(regex, '$1')).toISOString();
    return Promise.resolve(message);
  }
  function _category(message){
    let regex = /\sEFW:\s([a-zA-Z]+):/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'category' });
    }
    log.cat = match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _severity(message){
    let regex = /\sprio=([0-9]+)/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'severity' });
    }
    log.severity = +match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _logId(message){
    let regex = /\sid=([0-9]+)/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'logId' });
    }
    log.logId = +match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _revision(message){
    let regex = /\srev=([0-9]+)/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'revision' });
    }
    log.revision = +match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _event(message){
    let regex = /\sevent=([a-zA-z]+)/g;
    let match = message.match(regex);
    if(!match){
      return Promise.reject({ message: message, malformed: true, error: 'event' });
    }
    log.event = match[0].replace(regex, '$1');
    return Promise.resolve(message);
  }
  function _action(message){
    let regex = /\saction=([a-zA-z]+)/g;
    let match = message.match(regex);
    log.action = match ? match[0].replace(regex, '$1') : 'no action';
    return Promise.resolve(log);
  }

}