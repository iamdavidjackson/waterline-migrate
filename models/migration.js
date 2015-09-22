'use strict';

var Waterline = require('waterline');

var Migration = Waterline.Collection.extend({

  identity: 'migration',
  connection: 'mainDB',
  autoCreatedAt: true,
  attributes: {
    name: 'string'
  }
});

module.exports = exports = Migration;
