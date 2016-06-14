/**
 * a template engine
 * @version 0.0.1
 * @see https://github.com/riot/tmpl
 * 
 */

var _cache = {};

/**
 * The exposed tmpl function returns the template value from the cache, render with data.
 *
 * @param   {string} str  - Expression or template with zero or more expressions
 * @param   {Object} data - A Tag instance, for setting the context
 * @returns {*} Raw value of the expression or template to render
 * @private
 */
function _tmpl(str, data) {
    if (!str) return str; // catch falsy values here

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr);
}

_tmpl.compile = function(str) {
    if (!str) return str;

    return _cache[str] || (_cache[str] = _create(str));
};

_tmpl.errorHandler = null;

/**
 * Output an error message through the `_tmpl.errorHandler` function.
 *
 * @param {Error}  err - The Error instance generated by the exception
 * @param {object} ctx - The context
 * @private
 */
function _logErr(err, ctx) {
    if (_tmpl.errorHandler) {
        _tmpl.errorHandler(err);
    }
}

/**
 * Creates a function instance to get a value from the received template string.
 *
 * It'll halt the app if the expression has errors (Parse Error or SyntaxError).
 *
 * @param {string} str - The template. Can include zero or more expressions
 * @returns {Function} An instance of Function with the compiled template.
 * @private
 */
function _create(str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr;

    // if (arguments.length > 1) console.log('--- getter:\n    `' + expr + '`\n---');

    // Now, we can create the function to return by calling the Function constructor.
    // The parameter `E` is the error handler for runtime only.
    return new Function('E', expr + ';'); //eslint-disable-line no-new-func
}

var CH_IDEXPR = '\u2057',
    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
    S_QBLOCKS = R_STRINGS.source + '|' +
    /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
    /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
    // RE_CSNAME = /(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = new RegExp(S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g;

// istanbul ignore next: not both
var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][$\w]+(?=:)|(:|^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|JSON|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

var RE_BREND = {
    '(': /[()]/g,
    '[': /[[\]]/g,
    '{': /[{}]/g
};

/**
 * Parses an expression
 *
 * @param   {string} str - Raw template string, without comments
 * @returns {string} Processed template, ready for evaluation.
 * @private
 */
function _getTmpl(str) {
    var qstr = []; // hidden qblocks
    var expr;

    str = str.replace(RE_DQUOTE, '"');
    expr = _parseExpr(str, qstr);

    // Restore quoted strings and regexes
    if (qstr[0]) {
        expr = expr.replace(RE_QBMARK, function(_, pos) {
            return qstr[pos]
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n');
        });
    }

    return expr;
}

/**
 * Parses an individual expression `{expression}` or shorthand `{name: expression, ...}`
 *
 * For shorthand names, riot supports a limited subset of the full w3c/html specs of
 * non-quoted identifiers (closer to CSS1 that CSS2).
 *
 * The regex used for recognition is `-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*`.
 *
 * This regex accepts almost all ISO-8859-1 alphanumeric characters within an html
 * identifier. Doesn't works with escaped codepoints, but you can use Unicode code points
 * beyond `\u00FF` by quoting the names (not recommended).
 *
 * @param   {string} expr   - The expression, without brackets
 * @param   {Array}  qstr   - Where to store hidden quoted strings and regexes
 * @returns {string} Code to evaluate the expression.
 * @see {@link http://www.w3.org/TR/CSS21/grammar.html#scanner}
 *      {@link http://www.w3.org/TR/CSS21/syndata.html#tokenization}
 * @private
 */
function _parseExpr(expr, qstr) {
    var tb;

    expr = expr
        .replace(RE_QBLOCK, function(s, div) { // hide strings & regexes
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s;
        })
        .replace(/\s+/g, ' ').trim()
        .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    // console.log('>>> [_wrapExpr]', expr, key);
    expr = expr.replace(JS_VARNAME, function(match, p, mvar, pos, s) {
        // console.log('>>> [_wrapExpr1]', match, p, mvar, pos, s);
        if (mvar) {
            pos = tb ? 0 : pos + match.length; // check only if needed

            // this, window, and global needs try block too
            if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
                match = p + '("' + mvar + JS_CONTEXT + mvar;
                if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '[';
            } else if (pos) {
                tb = !JS_NOPROPS.test(s.slice(pos)); // needs try..catch block?
            }
        }
        return match;
    });

    if (tb) {
        expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    return expr;
}

module.exports = _tmpl;
