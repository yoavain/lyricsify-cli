import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
export const baseConfig: webpack.Configuration = {
    mode: "development",
    entry: "./src/index.ts",
    target: "node",
    node: {
        __filename: true,
        __dirname: true
    },
    externals: {
        knex: "knex",
        sqlite3: "sqlite3"
    },
    output: {
        path: path.join(__dirname, "_build"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.build.json",
                        transpileOnly: true
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "~src": path.resolve(__dirname, "src"),
            "~test": path.resolve(__dirname, "test"),
            "~resources": path.resolve(__dirname, "resources")
        }
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /\.(css|less)$/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /(sqlite3|pg|pg-query-stream|oracledb|mysql|mysql2|tedious)/ }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "node_modules/node-notifier/vendor/snoreToast/snoretoast-x64.exe",
                    to: "../dist/snoretoast-x64.exe",
                    toType: "file"
                },
                {
                    from: "resources/bin/lyricsify-launcher.exe",
                    to: "../dist/lyricsify-launcher.exe",
                    toType: "file"
                },
                {
                    from: "resources/notif-icons/",
                    to: "../dist/notif-icons/"
                }
            ]
        })
    ],
    devtool: "source-map"
};

export default baseConfig;
