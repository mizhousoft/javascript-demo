const webpack = require('webpack')
var path = require("path");

const vendors = [
    'react',
    'react-dom',
]

module.exports = {
    output: {
        path: __dirname,
        filename: '[name].[fullhash].js',
        library: '[name]_[fullhash]',
    },
    entry: {
        vendor: vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'manifest.json'),
            name: '[name]_[fullhash]',
            context: __dirname,
        }),
    ],
}
