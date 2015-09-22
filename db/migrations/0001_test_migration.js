'use strict';

var Promise = require('bluebird');
var winston = require('winston');

var migration = {};
module.exports = exports = migration;

var name = '0001_test_migration';

migration.up = function(models) {
	winston.debug('Applying migration ' + name);
	
	return models.collections.config.create({
			name: 'test',
			value: 'test value',
			data: {
				test: 'works'
			}
		})
		.then(function(model) {
			winston.debug('Successfully applied migration ' + name);
			return Promise.resolve();
		})
		.catch(function(e) {
			winston.debug('Error applying migration ' + name);
			return Promise.reject(e);
		});
};

migration.down = function() {
	console.log('running down function');
};
