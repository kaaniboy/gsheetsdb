const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'sheetsdb.js',
    path: path.resolve(__dirname, 'dist'),
  },
};