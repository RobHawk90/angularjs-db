const DB = require('./db');

var _db;

function DBFactory($q) {
  return function (config) {
    if (!_db)
      _db = new DB($q, config);
    return _db;
  };
}

module.exports = DBFactory;
