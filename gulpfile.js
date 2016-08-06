var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var maxmin = require('maxmin');
var map = require('map-stream');
var webpack = require('gulp-webpack');
var config = require('./webpack.config');
var Mocha = require('mocha');
var karma = require('karma').server;

/* ------------------- Size: print the file size ------------------- */
function Size(name) {
    this._name = name;
    this._max = undefined;
    this._min = undefined;
}
var p = Size.prototype;
p.max = function() {
    var self = this;
    return map(function(file, cb) {
        self._max = file.contents;
        cb(null, file);
    });
};
p.min = function(rename) {
    var self = this;
    return map(function(file, cb) {
        self._min = file.contents;
        rename && (file.path = rename(file.path));
        cb(null, file);
    });
};
p.print = function() {
    var self = this;
    setTimeout(function() {
        console.log(self._name, maxmin(self._max, self._min, true));
    }, 0);
};
/* ------------------- Size: print the file size ------------------- */

/* ------------------- local test ------------------- */
var testConf = require('./test/config');
gulp.task('test-local', function(done) {
    var mocha = new Mocha({
        ui: 'bdd',
        growl: true
    });
    require('should');

    var localDir;
    var stat;
    var p;
    var errCount = 0;
    for (var i = 0, l = testConf.local.length; i < l; ++i) {
        localDir = testConf.local[i];
        p = path.join(__dirname, 'test', localDir);
        stat = fs.statSync(p);
        if (stat.isDirectory()) {
            fs.readdirSync(p).forEach(function(fileName) {
                mocha.addFile(path.join(p, fileName));
            });
        }
    }

    mocha.run(function() {
        console.log('local test done');
        done(!errCount ? null : 'there are ' + errCount + ' local tests fail!');
        // }).on('pass', function(test) {
        //     console.log('... %s', test.title);
    }).on('fail', function(test) {
        // console.log('>>> fail:', test.title);
        errCount++;
    });
});
/* ------------------- local test ------------------- */

/* ------------------- browser test ------------------- */
gulp.task('test-browser', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['Chrome', 'PhantomJS']
    }, done);
});
/* ------------------- browser test ------------------- */

gulp.task('test', ['test-local', 'test-browser']);

var jqSize = new Size('Q.js');
gulp.task('Qui', function(done) {
    return gulp.src('./src/Q.js')
        .pipe(webpack(config))
        .pipe(jqSize.max())
        .pipe(gulp.dest('./dist'));
});
gulp.task('Qui-min', ['Qui'], function(done) {
    gulp.src('./dist/Qui.js')
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(jqSize.min(function(path) {
            return path.replace(/\.js$/, '.min.js');
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', function() {
            jqSize.print();
            done();
        });
});

gulp.task('default', ['Qui-min']);
