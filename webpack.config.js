const path = require('path');

module.exports = {
  entry: './src/sheetsdb.js',
  output: {
    filename: 'sheetsdb.js',
    path: path.resolve(__dirname, 'dist'),
  },
};