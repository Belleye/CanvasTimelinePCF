const path = require('path');

module.exports = {
    entry: './timelinecontrol/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'out/controls')
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript', // For TypeScript
                        ],
                    },
                },
            }
        ]
    },
    resolve: {
        alias: {
            'hammerjs': '@egjs/hammerjs'
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new webpack.ProvidePlugin({
            Hammer: '@egjs/hammerjs'
        })
    ]
};