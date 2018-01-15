import DBFactory from './db-factory';

export default angular.module('angularjsdb', [])
  .service('angularjsdb', ['$q', DBFactory]);
