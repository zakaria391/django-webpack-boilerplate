'use strict';

var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

module.exports = function (env) {
    env = env || {};

    var PRODUCTION = env.env == "production";

    var config = {
        context: __dirname + '/frontend',
        entry: {
            main: './js/main',
            css_site: './sass/site'
        },

        output: {
            path: __dirname + '/dist/app',
            publicPath: '/static/app/',
            filename: 'js/[name].js'
        },

        resolve: {
            extensions: ['.js', '.scss'],
            modules: [__dirname + '/frontend', "node_modules"]
        },

        watch: !PRODUCTION,

        watchOptions: {
            aggregateTimeout: 300,
            poll: 500
        },

        module: {
            rules: [
                {
                    test: /\.scss$/,

                    use: ExtractTextPlugin.extract({
                        use: [
                            {loader: "css-loader", options: {sourceMap: true}},
                            {loader: "resolve-url-loader"},
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true,
                                    outputStyle: 'expanded',
                                    sourceComments: true
                                }
                            }
                        ]
                    })
                },

                {
                    test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: '[path][name].[ext]'
                            }
                        }
                    ]
                }
            ],

            noParse: [
                /jquery\.js$/
            ]
        },

        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),

            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.optimize.CommonsChunkPlugin({name: 'common', minChunks: 2}),

            new ExtractTextPlugin({
                filename: "css/[name].css",
                allChunks: true
            }),

            new Clean(__dirname + '/dist/app')
        ],

        devtool: PRODUCTION ? false : 'inline-source-map'
    };

    if (PRODUCTION) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    // don't show unreachable variables etc
                    warnings: false,
                    drop_console: true,
                    unsafe: true
                }
            })
        );
    }

    return config;
};