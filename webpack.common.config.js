const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./lms/static/js/main.js",
    cms: "./cms/static/js/cms_main.js",
  },
  output: {
    path: path.resolve(__dirname, "staticfiles/bundles"),
    filename: "[name]-[contenthash].js",
    publicPath: "/static/bundles/",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({filename: "[name]-[contenthash].css"}),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"},
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {extensions: [".js", ".jsx"]},
};
