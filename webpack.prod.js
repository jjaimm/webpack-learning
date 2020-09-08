let path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

let setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, `./src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: ['vendors', pageName],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }));
    })
    return {
        entry,
        htmlWebpackPlugins
    };
}

const {entry, htmlWebpackPlugins} = setMPA();

module.exports = {
    mode: 'production',
    entry,
    output: {
        filename: "[name]_[chunkhash:8].js",
        path: path.join(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ["babel-loader", 'eslint-loader']
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: "file-loader"
            },
            {
                test: /.css$/,
                use: ["style-loader", 'css-loader']
            },
            {
                test: /.less$/,
                use: ["style-loader", 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        ...htmlWebpackPlugins,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: ''
        }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
        //             global: 'React'
        //         }, {
        //             module: 'react-dom',
        //             entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
        //             global: 'ReactDOM'
        //         }
        //     ]
        // })
        // new OptimizeCssAssetsWebpackPlugin({
        //     assetNameRegExp: /\.css$/g,
        //     cssProcessor: require('cssnano')
        // }),
        // function () {
        //     this.hooks.done.tap('done', (stats) => {
        //         if (
        //             stats.compilation.errors
        //             && stats.compilation.errors.length
        //             && process.argv.indexOf('--watch') === -1
        //         ) {
        //             console.log('build error');
        //             process.exit(1);
        //         }
        //     })
        // }
    ],
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: "all",
                    minChunks: 2
                }
            }
        }
    }
};
// module.exports = {
//     mode: 'none',
//     stats: "errors-only",
//     entry: {
//         'large-number': './src/common/index.js',
//         'large-number.min': './src/common/index.js',
//     },
//     output: {
//         filename: "[name].js",
//         library: 'largeNumber',
//         libraryTarget: 'umd',
//         libraryExport: 'default'
//     },
//     plugins: [
//         new FriendlyErrorsWebpackPlugin()
//     ],
//     optimization: {
//         minimize: true,
//         minimizer: [
//             new TerserPlugin({
//                 include: /\.min\.js$/
//             })
//         ]
//     }
// };