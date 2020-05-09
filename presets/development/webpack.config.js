const path = require('path');

module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-'
        }
    },
    entry: {
        theme: './theme.js',
        portal: './portal.js',
        admin: './admin.js'
    },
    output: {
        filename: '[name].app.js',
        path: path.resolve(__dirname, '../public/')
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
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
