const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: './src/webcomponent.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dist.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "testFiles/index.html", to: "index.html"},
            ]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8080
    }
};
