const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'sources/index.ts'),
    output: {
        filename: 'app.js',
        path: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
}