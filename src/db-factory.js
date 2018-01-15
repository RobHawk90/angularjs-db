import DB from './db';

var _db;

function DBFactory($q) {
  return function (config) {
    if (!_db)
      _db = new DB($q, config);
    return _db;
  };
}

export default DBFactory;
