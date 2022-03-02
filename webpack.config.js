const path = require("path");

module.exports = {
    // WebPack entry point:
    entry: "./frontend/src/script/script.js",

    // WebPack output:
    output: {
        // Absolute path:
        path: path.resolve(__dirname, "./frontend/public/script/"),
        filename: "script.js",   
    },

    // Babel loader:
    module: {
        rules: [{
            // Look for all files that end in .js
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    }

};