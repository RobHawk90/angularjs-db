const path = require('path');

module.exports = {
  entry: './src/angularjs-db.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'angularjs-db.min.js'
  }
};
