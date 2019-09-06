const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = (...paths) => path.resolve.apply(__dirname, ['src', ...paths]);
const root = (...paths) => path.resolve.apply(__dirname, [...paths]);

module.exports = {
    entry: {
        app: src('index.jsx')
    },
    output: {
        path: root('dist'),
        filename: '[name].[hash].bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.pcss'],
        alias: {
            _constants: src('constants'),
            _components: src('components'),
            _contexts: src('contexts'),
            _services: src('services'),
            _modules: src('modules'),
            _utils: src('utils'),
            _hooks: src('hooks'),
            _src: src(),
            _root: root()
        }
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.pug$/, exclude: /node_modules/, loader: 'pug-loader' },
            {
                test: /\.p?css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: { path: root('./config') }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: src('index.pug')
        }),
        new CopyWebpackPlugin([
            { from: src('assets'), to: root('dist/assets') }
        ])
    ]
};
