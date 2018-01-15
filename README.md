# AngularJS DB &middot; [![npm version](https://badge.fury.io/js/angularjs-db.svg)](https://www.npmjs.com/package/angularjs-db) [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/RobHawk90/angularjs-db/blob/master/LICENSE)

AngularJS DB is a AngularJS service library that wraps the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for local browser database access

## Installation

AngularJS DB is available as the `angularjs-db` package on [npm](https://www.npmjs.com/). Just run `npm install --save angularjs-db` to save it in your project.

## Examples
app.js
```js
(function () {
  angular.module('todoApp', ['angularjsdb'])
    .controller('TodoController', ['$scope', 'angularjsdb', TodoController]);

  function TodoController($scope, angularjsdb) {
    $scope.todo = newTodo();
    $scope.todos = [];
    $scope.add = add;
    $scope.remove = remove;
    $scope.toggleCompleted = toggleCompleted;

    var db = angularjsdb({
      name: 'todos_indexeddb',
      version: 1,
      stores: ['todos']
    });

    db.list('todos').then(function (todos) {
      $scope.todos = todos;
    });

    function add(todo) {
      db.add('todos', todo).then(function (result) {
        todo.id = result;
        $scope.todos.push(todo);
        $scope.todo = newTodo();
      });
    }

    function remove(todo) {
      db.delete('todos', todo.id).then(function () {
        var index = $scope.todos.indexOf(todo);
        $scope.todos.splice(index, 1);
      });
    }

    function toggleCompleted(todo) {
      db.put('todos', { completed: !todo.completed }, todo.id).then(function () {
        todo.completed = !todo.completed;
      });
    }

    function newTodo() {
      return {
        name: '',
        completed: false
      };
    }
  }
})();
```

index.html
```html
<!DOCTYPE html>
<html lang="en" ng-app="todoApp">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>angularjsdb</title>
  <script src="node_modules/angular/angular.js"></script>
  <script src="node_modules/angularjs-db/dist/angularjs-db.min.js"></script>
  <script src="app.js"></script>
</head>

<body ng-controller="TodoController">

  <form ng-submit="add(todo)">
    <input ng-model="todo.name">
    <button>add</button>
  </form>

  <ul>
    <li ng-repeat="todo in todos">
      <button ng-click="remove(todo)">&times;</button>
      <label>
        <input type="checkbox" ng-checked="todo.completed" ng-click="toggleCompleted(todo)"> {{todo.name}}
      </label>
    </li>
  </ul>
</body>

</html>
```
