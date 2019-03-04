const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = (...paths) => path.resolve.apply(__dirname, ['src', ...paths]);
const root = (...paths) => path.resolve.apply(__dirname, [...paths]);

module.exports = {
    entry: {
        app: src('index.js')
    },
    output: {
        path: root('dist'),
        filename: '[name].[hash].bundle.js'
    },
    resolve: {
        extensions: [',js', ',styl'],
        alias: {
            _constants: src('constants'),
            _js: src('js'),
            _css: src('css'),
            _html: src('html')
        }
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.pug$/, exclude: /node_modules/, loader: 'pug-loader' },
            { test: /\.styl$/, exclude: /node_modules/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: src('index.pug')
        })
    ]
};
