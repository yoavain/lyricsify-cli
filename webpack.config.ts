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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "node_modules/node-notifier/vendor/snoreToast/snoretoast-x64.exe",
                    to: "../dist/snoretoast-x64.exe",
                    toType: "file"
                },
                {
                    from: "bin/sqlite/sqlite3.exe",
                    to: "../dist/bin/sqlite/sqlite3.exe",
                    toType: "file"
                },
                {
                    from: "resources/bin/lyricsify-launcher.exe",
                    to: "../dist/lyricsify-launcher.exe",
                    toType: "file"
                },
                {
                    from: "node_modules/puppeteer/.local-chromium/win64-970485/chrome-win/",
                    to: "../dist/chrome-win/",
                    filter: (filepath) => !filepath.endsWith("interactive_ui_tests.exe")
                },
                {
                    from: "resources/notif-icons/",
                    to: "../dist/notif-icons/"
                },
                {
                    from: "resources/config/lyricsify.env",
                    to: "../dist/config/lyricsify.env"
                }
            ]
        })
    ],
    devtool: "source-map"
};

export default baseConfig;
