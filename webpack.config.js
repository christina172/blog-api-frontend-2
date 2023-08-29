const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        index: './src/scripts/index.js',
        post: './src/scripts/post.js',
        form: './src/scripts/form.js',
        login: './src/scripts/login.js'
    },
    devtool: "inline-source-map",
    output: {
        path: path.join(__dirname, 'dist/'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png\svg\jpg\jpeg\gif)$/i, type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/pages/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/post.html',
            inject: true,
            chunks: ['post'],
            filename: 'post.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/form.html',
            inject: true,
            chunks: ['form'],
            filename: 'form.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/login.html',
            inject: true,
            chunks: ['login'],
            filename: 'login.html'
        }),
    ]
};