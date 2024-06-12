const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  cache: false,
  mode: "development",
  devtool: "eval-cheap-source-map",
  entry: {
    preview: './src/preview-src/index.js',
    main: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, "build"),
    clean: true,
    filename: (chunkData) => {
      return `${chunkData.chunk.name}/${chunkData.chunk.name}.min.js`; // Put the bundles in separate folders
    },
  },
  resolve: {
    extensions: [".tsx", ".js", '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/', // Change the output path as needed
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(scss)$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
          // {
          //   loader: "sass-loader",
          //   options: {
          //     indentedSyntax: true, // Enable nesting
          //   },
          // },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { "runtime": "automatic" }]],
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000, // Any file below this size will be converted into a data URL
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      chunks: ["main"],
      filename: "index.html",
      publicPath: "/",
      appPath: "/",
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        minifyURLs: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: "public/preview.html",
      chunks: ["preview"],
      filename: "preview.html",
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        minifyCSS: true,
        minifyURLs: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),


  ],
  devServer: {
    port: 3002,
    historyApiFallback: true,
  },
};