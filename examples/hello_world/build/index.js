var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var rename = require('gulp-rename');

var componentBuilder = require('../../lib/componentBuilder');

const TASKNAME = 'examples-hello-world';
const cwd = process.cwd();
const pathPrefix = path.relative(cwd, path.join(__filename, '../..'))
                    .replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/');

gulp.task(TASKNAME, function() {
    gulp.src(pathPrefix + '/components/*/main.html')
        .pipe(componentBuilder())
        .pipe(rename({ basename: 'index', extname: '.js' }))
        .pipe(gulp.dest(pathPrefix + '/tmp/'));
});

module.exports = TASKNAME;