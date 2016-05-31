# syslog-storage-server

### How to use

##### Server startup

Node modules installation. 
```
    $ npm install
```

Server bootstrap

- -s is for Syslog server
- -r is for REST api server

```
    $ node app.js -s 3000 -r 5000
```

Api Endpoints:
---

**GET** */logs* - Get All logs
**GET** */stats* - Get Stats
