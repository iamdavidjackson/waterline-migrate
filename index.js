 /*!
 * waterline-migrate
 * Copyright(c) 2014-2015 David Jackson
 * MIT Licensed
 */

'use strict';

var fs = require('fs');
var path = require("path");
var Promise = require('bluebird');

exports = module.exports = function(options) {
	var app = options.app;
	var migrationDir = options.dir;

	return {
		migrate: function(models) {

			var promises = [];

			// search through the migrations folder to get migrations
			fs
			  .readdirSync(migrationDir)
			  .filter(function(file) {
			    return (file.indexOf(".") !== 0);
			  })
			  .forEach(function(file) {
			  	// for each one lets check if it has been applied and apply it if not
			  	promises.push(new Promise(function(resolve, reject) {
			  		// search the database for the migration removing the .js from the filename
			  		var filename = path.basename(file, '.js');

			  		return models.collections.migration.findOne()
				  		.where({ name: filename })
				  		.then(function(migration) {
				  			
				  			// check if there is anything in the value returned
				  			if(typeof migration !== 'undefined') {
				  				logger('debug', 'Already applied migration ' + filename);
				  				return resolve();
				  			} else {
				  				// ideally this means that the record wasn't found
				  				var migrationModule = require(path.join(migrationDir, file));
					    		return migrationModule.up(models)
					    			.then(function() {
					    				return models.collections.migration.create({
					    					name: filename
					    				})
					    				.then(function(migration) {
					    					logger('debug', 'Saved migration ' + filename + ' record to db');
					    					return resolve();
					    				})
					    				.catch(function(e) {
					    					logger('error', 'An error occured while saving migration ' + filename + ' record to db');
					    					return reject(e);
					    				});
					    			});
				  			}
				  		})
				  		.catch(function(e) {
				  			logger('error', 'An error occured while migrating the database.');
				  			throw e;
				  		});
			  	}));
			  });

			return Promise.all(promises)
				.then(function() {
					logger('debug', 'Migration Complete');
					return models;
				})
				.catch(function(e) {
					throw e;
				});
		}

	}

	function logger(level, message) {
		if (typeof options.logger !== 'undefined' &&
			typeof options.logger[level] === 'function' && 
			typeof message !== 'undefined' && message !== '' && 
			typeof level !== 'undefined' && level !== ''
		) {
			options.logger[level](message);
		}
	}
}