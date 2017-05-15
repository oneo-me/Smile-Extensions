var fs = require("fs-extra")
var path = require("path")
var zipper = require("zip-local")
var webpack = require("webpack")

var webpackConfig = {
    entry: path.resolve(__dirname, "./src/main.js"),
    output:
    {
        path: path.resolve(__dirname, "./build"),
        publicPath: "/build",
        filename: "index.js"
    },
    module:
    {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                loader: "style-loader!css-loader!stylus-loader"
            }
        ]
    },
    plugins: []
}

// manifest
var package = fs.readJSONSync(path.resolve(__dirname, "./package.json"))
var manifest = package.manifest
manifest.name = package.displayName
manifest.description = package.description
manifest.version = package.version
if (manifest.browser_action == null) {
    manifest.browser_action = {}
}
manifest.browser_action.default_icon = "icon.png"
manifest.icons = {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
}
manifest.manifest_version = 2
fs.writeJSONSync(path.resolve(__dirname, "./build/manifest.json"), manifest, { spaces: 4 })

// build
if (process.env.NODE_ENV == "production") {
    webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }))
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }))
    webpackConfig.plugins.push(new webpack.ProgressPlugin(function (percentage, msg) {
        if (percentage == 1) {
            var build = path.resolve(__dirname, "./build")
            fs.removeSync(build + ".zip")
            zipper.sync.zip(build).compress().save(build + ".zip")
        }
    }))
}

module.exports = webpackConfig