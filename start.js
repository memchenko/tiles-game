const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config/webpack.common');

const PORT = 3000;

config.mode = 'development';

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
    contentBase: config.output.path,
    hot: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: 'minimal'
});

server.listen(PORT, 'localhost', () => {
    /* eslint-disable no-console */
    console.log('Webpack dev server listening on', PORT);
});
