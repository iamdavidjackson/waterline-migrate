# waterline-migrate
Simple migration tool for Waterline ORM

Definitely a work in progress but the idea is to add migrations to [Waterline](https://github.com/balderdashy/waterline).  Currently it only supports "up" actions and some kind of "down" support should probably be added.  

## Installation

`$ npm install waterline-migrate`

## API

Initialize the object by passing in a directory path and an optional logger.

```
var waterlineMigrate = require('waterline-migrate')({
    dir: path.resolve(__dirname, 'db/migrations'),
    logger: winston
});
```

Initialize Waterline and load collections including the Migration collection.

```
var Waterline = require('waterline'),
	Migration = require('../models/migration');

var waterline = new Waterline();
waterline.loadCollection(Migration);

var config = { ... };

waterline.initialize(config, function(err, models) {
	if(err) throw err;

	waterlineMigrate.migrate(models);
});
```

## Promises

Waterline Migrate makes use of Promises via Bluebird so you can chain things together nicely like this.

```
var db = require('../config/orm'),
    path = require("path"),
    Promise = require('bluebird'),
    winston = require('winston');


var migrationUtil = require('../utils/migrations')({
    dir: path.resolve(__dirname, '../db/migrations'),
    logger: winston
});

winston.level = 'debug';

initializeDB()
    .then(function(models) {
        return migrationUtil.migrate(models);
    })
    .then(function(models) {
        // Initialize Express
        winston.debug('DB Migration complete, initializing server');
        var app = require('./express')(models);
        return app;
    })
    .catch(function(e) {
        console.log('error', e);
        winston.error('Error initializing server');
    });


function initializeDB() {
    // initialize the Database
    return new Promise(function(resolve, reject) {
        winston.debug('Initializing Database');
        db.initialize(function(err, models) {
            if(err) {
                winston.error('Error initializing database');
                return reject(err);
            }
            winston.debug('Database initialized');
            return resolve(models);
        });
    });
}
```
	