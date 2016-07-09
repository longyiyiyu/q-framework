/**
 * mixin.js
 * the functions of mixin
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var cache = {};

/*
 * mixin 
 * main function for exports
 * @param   {String}            name        name of mixin
 * @param   {Object|Function}   m           mixin
 *
 * @example
 *
 * // set the mixin
 * obj.mixin('a', mix);
 *
 * // use the mix of 'a'
 * obj.mixin('a');
 *
 * // use function as mix
 * obj.mixin(function() {});
 *
 * // use object as mix
 * obj.mixin({});
 *
 * // use some mixin
 * obj.mixin(['a', function() {}, {}]);
 * 
 */
function mixin(name, m) {
    if (typeof name !== 'string') {
        m = name;
        name = null;
    }

    if (name && m) { // set
        if (typeof m === 'object' || typeof m === 'function') {
            cache[name] = m;
        }
        return this;
    }

    if (!m && typeof name === 'string') {
        m = cache[name];
    }

    if (!m) {
        return this;
    }

    if (!(m instanceof Array)) {
        m = [m];
    }

    var mix;

    for (var i = 0, l = m.length; i < l; ++i) {
        mix = m[i];
        if (typeof mix === 'string') {
            mix = cache[mix];
        }

        if (mix) {
            if (typeof mix === 'object') {
                if (mix.init) {
                    mix.init(this);
                    delete mix.init;
                }

                util.extend(this, mix);
            } else if (typeof mix === 'function') {
                mix(this);
            }
        }
    }

    return this;
}

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        mixin: mixin
    });
}

module.exports = enhancer;
