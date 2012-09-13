var path = require('path');

try {
  require('./coffee-inheritance');
} catch (e) {}

// require tower
var root = path.join(__dirname, 'lib/tower.js');

if (path.existsSync(root))
  module.exports = require(root);
else
  module.exports = require(path.join(__dirname, 'packages/tower.coffee'));
