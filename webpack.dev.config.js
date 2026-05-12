const {merge} = require("webpack-merge");
const common = require("./webpack.common.config.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./staticfiles",
    hot: true,
    port: 3000,
    proxy: [
      {context: ["/api", "/dashboard", "/login", "/register", "/kids", "/studio"],
       target: "http://localhost:8000"},
    ],
  },
});
