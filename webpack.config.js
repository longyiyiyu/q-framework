var webpack = require('webpack');
var config = require('./package');
var banner =
    '/*!\n' +
    ' * Qui.js v' + config.version + '\n' +
    ' * ' + config.description + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' longyiyiyu\n' +
    ' * Released under the MIT License.\n' +
    ' */\n';

module.exports = {
    output: {
        filename: 'Qui.js',
        library: 'Q',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin(banner, {
            raw: true
        }), 
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify('S')
        }),
        // new webpack.optimize.UglifyJsPlugin(),
        // new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
