const path = require('path');

module.exports = {
    entry: {
        portal: './portal.js',
        admin: './admin.js',
    },
    output: {
        filename: '[name].app.js',
        path: path.resolve(__dirname, '../build/')
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
