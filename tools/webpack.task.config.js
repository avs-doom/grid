'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const BUILD_PATH = path.resolve('build');
const RESOURCE_PATH = path.resolve('resource');
const NODE_MODULES_PATH = path.resolve('node_modules');


module.exports = function(env, argv) {
    
    [BUILD_PATH].forEach(PATCH => {
        if (!fs.existsSync(PATCH)) {
            fs.mkdirSync(PATCH);
        }
    });
    
    const isForProduction = argv.mode === 'production';
    
    return  {
            
        devtool: isForProduction ? false : 'source-map',
        
        context: path.resolve(__dirname, '..', RESOURCE_PATH),
        
        devServer: {
            historyApiFallback: false,
            hot: false,
            https: false,
            compress: true,
            inline: true
        },
        
        performance: {
            maxEntrypointSize: 625000,
            maxAssetSize: 625000
        },
        
        entry: [
            'babel-polyfill',
            path.posix.join('js', 'main.jsx'),
            path.posix.join('scss', 'main.scss')
        ],
        
        output: {
            filename: 'assets/[name].js',
            path: path.resolve(__dirname, '..', 'build'),
            publicPath: '/'
        },
        
        module: {
            
            rules: [

                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|templates|images|scss|fonts)/,
                    include: /(js)/,
                    enforce: 'post',
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            ['env', {
                                'loose': true
                            }],
                            'stage-0',
                            'react'
                        ],
                        plugins: [
                            'transform-decorators-legacy',
                            ['transform-runtime', {
                                helpers: false,
                                polyfill: true,
                                regenerator: true,
                                moduleName: 'babel-runtime'
                            }]
                        ]
                    }
                },
                
                {
                    test: /\.scss$/,
                    exclude: /(node_modules|js|templates|images)/,
                    include: /(scss|fonts)/,
                    enforce: 'post',
                    use: [{
                        loader: 'css-hot-loader'
                    }, {
                        loader: MiniCssExtractPlugin.loader
                    }, {
                        loader: 'css-loader',
                        options: {
                            cache: true,
                            debug: true,
                            root: path.resolve(__dirname, '..', 'build')
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                },
                
                {
                    test: /\.html$/,
                    exclude: /(node_modules|scss|images|fonts)/,
                    include: /(templates|js)/,
                    enforce: 'post',
                    use: [{
                        loader: 'html-loader'
                    }, {
                        loader: `preprocess-loader?NODE_ENV=${argv.mode}`
                    }]
                }
            ]
        },
        
        resolve: {
            modules: [
                NODE_MODULES_PATH,
                RESOURCE_PATH
            ],
            extensions: ['.html', '.scss', '.js', '.jsx']
        },
        
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                filename: 'assets/[name].css',
                chunkFilename: '[id].css'
            }),
            new HtmlWebpackPlugin({
                template: path.posix.join(RESOURCE_PATH, 'templates', 'index.html'),
                filename: 'index.html',
                inject: true,
                hash: true,
                minify: {
                    removeComments: isForProduction,
                    collapseWhitespace: isForProduction
                }
            })
        ]
    };
    
    return config;
};