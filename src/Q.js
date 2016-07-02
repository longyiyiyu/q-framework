/**
 * Q.js
 * the version 2 of Qjs which is a ui framework
 * when the version 1 of Qjs is a mvvm framwork
 *
 * @author  longyiyiyu
 * @version 2.0.0
 * 
 */
var Q = {
    version: '2.0.0'
};

// enhance directive
require('./core/directive')(Q, Q);

// enhance component
require('./core/component')(Q, Q);

module.exports = Q;