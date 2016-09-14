var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var cheerio = require('cheerio');

// 常量
const PLUGIN_NAME = 'gulp-qui-component-builder';

function main() {
    return through.obj(function(file, enc, cb) {
        var html;
        var $;
        var ret;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            // console.log('>>>', file.path, '>>>', file.contents.toString('utf-8'));
            // file.contents = Buffer.concat([new Buffer('<h1>111</h1>'), file.contents]);
            html = file.contents.toString('utf-8');
            $ = cheerio.load(html, {
                normalizeWhitespace: true
            });
            console.log('>>> file:', $.html(), '>>>>', $.root().children().get(0).tagName);
            
            ret = ['var Q = require(\'Q\');\n', 'Q.component(\'', $.html(), '\');', '\nmodule.exports = Q;'];

            file.contents = new Buffer(ret.join('').replace(/\\/g, '\\\\'));
        }

        this.push(file);
        cb();
    });
}

module.exports = main;
