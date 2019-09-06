const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const path = require('path');

const config = require('./config/webpack.common');

const PORT = 3000;

config.mode = 'development';
config.devtool = 'cheap-module-source-map';

const options = {
    contentBase: config.output.path,
    hot: true,
    host: 'localhost',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: 'minimal',
    historyApiFallback: true,
    writeToDisk: true,
    setup(app) {
        app.get('/assets/:fileName', (req, res) => {
            const filePath = path.resolve(process.cwd(), 'dist', 'assets', req.params.fileName);
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.status(404).send('Whatever');
                } else {
                    res.status(200).send(data.toString('utf8'));
                }
            });
        });
    }
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

server.listen(PORT, 'localhost', () => {
    /* eslint-disable no-console */
    console.log('Webpack dev server listening on', PORT);
});
