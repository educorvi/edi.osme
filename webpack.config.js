const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/loadMap.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dist.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "testFiles/index.html", to:"index.html"},
                {from: "testFiles/locations", to:"."}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        contentBase:'./dist',
        hot: true,
        port: 8080
    }
};
