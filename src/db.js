var _connection;

function DB($q, config) {
  var self = this;
  self.add = add;
  self.list = list;
  self.delete = remove;
  self.get = get;
  self.put = put;
  self.openStore = openStore;

  function add(store, object) {
    return _getConnection($q, config).then(function (connection) {
      var deferred = $q.defer();
      var request = openStore(connection, store).add(object);
      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };
      return deferred.promise;
    });
  }

  function list(store) {
    return _getConnection($q, config).then(function (connection) {
      var deferred = $q.defer();
      var objects = [];
      var request = openStore(connection, store).openCursor();
      request.onsuccess = function (event) {
        var result = event.target.result;
        if (result) {
          objects.push(result.value);
          result.continue();
        } else
          deferred.resolve(objects);
      };
      return deferred.promise;
    });
  }

  function get(store, key) {
    return _getConnection($q, config).then(function (connection) {
      var deferred = $q.defer();
      var request = openStore(connection, store).get(key);
      request.onsuccess = function (event) {
        deferred.resolve(event.target.result);
      };
      return deferred.promise;
    });
  }

  function remove(store, key) {
    return _getConnection($q, config).then(function (connection) {
      var deferred = $q.defer();
      var request = openStore(connection, store).delete(key);
      request.onsuccess = function () {
        deferred.resolve();
      };
      return deferred.promise;
    });
  }

  function put(store, object, key) {
    return $q.all([_getConnection($q, config), get(store, key)])
      .then(function (data) {
        var deferred = $q.defer();
        var connection = data[0];
        var existent = data[1];
        for (var prop in object) {
          existent[prop] = object[prop];
        }
        var request = openStore(connection, store).put(existent);
        request.onsuccess = function (event) {
          deferred.resolve();
        };
        return deferred.promise;
      });
  }

  function openStore(connection, store) {
    return connection.transaction([store], 'readwrite').objectStore(store);
  }
}

function _getConnection($q, config) {
  var deferred = $q.defer();

  if (_connection) {
    deferred.resolve(_connection);
    return deferred.promise;
  }

  var db = window.indexedDB.open(config.name, config.version);

  db.onupgradeneeded = function (event) {
    var connection = event.target.result;
    config.stores.forEach(function (store) {
      if (connection.objectStoreNames.contains(store))
        connection.deleteObjectStore(store);
      connection.createObjectStore(store, {
        keyPath: 'id',
        autoIncrement: true
      });
    });
  };

  db.onsuccess = function (event) {
    _connection = event.target.result;
    deferred.resolve(_connection);
  };

  return deferred.promise;
}

export default DB;
