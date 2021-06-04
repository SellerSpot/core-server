import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

const webpackConfiguration = (env: { ENV: 'production' | 'development' }): Configuration => {
    const isProduction = env.ENV === 'production' ? true : false;
    return {
        entry: './src',
        externals: [nodeExternals()],
        devtool: !isProduction ? 'eval-source-map' : false,
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [new TsconfigPathsPlugin()],
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'index.js',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: isProduction,
                    },
                    exclude: [/dist/, /node_modules/],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    files: './src',
                },
            }),
        ],
        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
        },
        watch: !isProduction,
    };
};

export default webpackConfiguration;
