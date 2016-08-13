__ENV__ = 'B';

var Q = require('../src/Q');

require('./spec/text')(Q);
require('./spec/html')(Q);
require('./spec/class')(Q);
require('./spec/attr')(Q);
require('./spec/css')(Q);
require('./spec/show')(Q);
require('./spec/value')(Q);
require('./spec/on')(Q);
require('./spec/if')(Q);
require('./spec/component')(Q);
require('./spec/repeat')(Q);