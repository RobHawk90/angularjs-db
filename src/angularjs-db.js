const DBFactory = require('./db-factory');

angular.module('angularjsdb', [])
  .service('angularjsdb', DBFactory);
