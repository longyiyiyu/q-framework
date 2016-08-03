var gulp = require('gulp');
var uglify = require('gulp-uglify');
var maxmin = require('maxmin');
var map = require('map-stream');
var webpack = require('gulp-webpack');
var config = require('./webpack.config');

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