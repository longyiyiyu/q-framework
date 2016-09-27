var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var rename = require('gulp-rename');
var webpack = require('webpack');
var gwebpack = require('gulp-webpack');

var componentBuilder = require('../../lib/componentBuilder');

const TASKNAME = 'examples-hello-world';
const cwd = process.cwd();
const pathPrefix = path.relative(cwd, path.join(__filename, '../..'))
    .replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/');

gulp.task(TASKNAME, function() {
    gulp.src(pathPrefix + '/components/*/main.html')
        .pipe(componentBuilder())
        .pipe(rename({
            basename: 'index',
            extname: '.js'
        }))
        .pipe(gulp.dest(pathPrefix + '/tmp/'));

    gulp.src(pathPrefix + '/index.js')
        .pipe(gwebpack({
            resolve: {
                alias: {
                    'Q': path.join(path.dirname(__filename), '../../../src/Q.js'),
                    'com': path.join(path.dirname(__filename), '../components')
                }
            },
            plugins: [
                new webpack.DefinePlugin({
                    __ENV__: JSON.stringify('B')
                })
            ]
        }))
        .pipe(rename({
            basename: 'index',
            extname: '.js'
        }))
        .pipe(gulp.dest(pathPrefix + '/dist/'));
});

module.exports = TASKNAME;
