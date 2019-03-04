const plugins = [
    "autoprefixer",
    "postcss-at-rules-variables",
    "postcss-custom-media",
    "postcss-import",
    "postcss-loader",
    "postcss-media-minmax",
    "postcss-mixins",
    "postcss-nested",
    "postcss-responsive-properties",
    "postcss-simple-extend",
    "postcss-simple-vars",
    "postcss-uncss"
];

module.exports = {
    parser: 'sugarss',
    plugins: plugins.map(plugin => require(plugin))
};
