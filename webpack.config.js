const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");

let isProduction = process.env.NODE_ENV === "production";
let isWebProduction = process.env.web === "true";
let isESLINT = process.env.ESLINT === "true";
let isDevelopment = !isProduction && !isWebProduction;

let entry = { main: "./src/index.tsx" };

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
    excludeChunks: isDevelopment && [
      "background",
      "content",
      "notification",
      "page",
    ],
  }),
  new webpack.ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
  }),
  new webpack.ProvidePlugin({
    process: "process/browser.js",
  }),
  new Dotenv(),
  isESLINT && new ESLintPlugin(),
  new webpack.DefinePlugin({
    // PRODUCTION: JSON.stringify(true),
    // VERSION: JSON.stringify("5fa3b9"),
    // BROWSER_SUPPORTS_HTML5: true,
    // TWO: "1+1",
    // "typeof window": JSON.stringify("object"),
    "process.env.SKIP_SEEDPHRASE": JSON.stringify(process.env.SKIP_SEEDPHRASE),
    "process.env.isTesting": JSON.stringify(process.env.isTesting),
    "process.env.web": JSON.stringify(process.env.web),
    ...(isWebProduction && {
      "process.env.REACT_APP_ANKR_API_KEY": JSON.stringify(
        process.env.REACT_APP_ANKR_API_KEY
      ),
    }),
  }),
].filter(Boolean);

if (isProduction) {
  plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/manifest.json", to: "./manifest.json" },
        { from: "./public/16.ico", to: "./16.ico" },
        { from: "./public/48.ico", to: "./48.ico" },
      ],
    })
  );

  entry.background = "./src/background.js";
  entry.content = "./src/content.js";
  entry.notification = "./src/notification-manager.js";
  entry.page = "./src/page.js";
} else {
  plugins.push(
    new CopyWebpackPlugin({
      patterns: [{ from: "./public/16.ico", to: "./16.ico" }],
    })
  );
}

if (isDevelopment) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode: isDevelopment ? "development" : "production",

  entry,

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          isDevelopment && require.resolve("style-loader"),
          !isDevelopment && {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" },
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              sourceMap: isDevelopment,
            },
          },
        ].filter(Boolean),
        sideEffects: true,
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
      },
      {
        test: /\.(woff2)$/,
        type: "asset",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      },
    ],
  },

  plugins,

  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      fs: false,
    },
    alias: {
      abis: path.resolve(__dirname, "src/abis"),
      assets: path.resolve(__dirname, "src/assets/"),
      components: path.resolve(__dirname, "src/components/"),
      hoc: path.resolve(__dirname, "src/hoc/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      popup: path.resolve(__dirname, "src/popup/"),
      routes: path.resolve(__dirname, "src/routes/"),
      store: path.resolve(__dirname, "src/store/"),
      scripts: path.resolve(__dirname, "src/scripts/"),
      theme: path.resolve(__dirname, "src/theme/"),
      utils: path.resolve(__dirname, "src/utils/"),
      api: path.resolve(__dirname, "src/api.ts"),
      classes: path.resolve(__dirname, "src/classes/"),
      interfaces: path.resolve(__dirname, "src/interfaces/"),
      mock: path.resolve(__dirname, "src/mock"),
      "redux-hook": path.resolve(__dirname, "src/redux-hook.ts"),
      "@slices": path.resolve(__dirname, "src/store/slices/"),
      "@styled": path.resolve(__dirname, "src/components/styled/"),
      "background-related": path.resolve(__dirname, "src/background-related/"),
      "window-provider": path.resolve(__dirname, "src/window-provider/"),
      "provider-bridge-shared": path.resolve(
        __dirname,
        "src/provider-bridge-shared/"
      ),
      "__test-utils__": path.resolve(__dirname, "src/__test-utils__"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  experiments: {
    topLevelAwait: true,
  },

  // devtool: isDevelopment ? "source-map" : false,
  devtool: "source-map",
  // devtool: false,

  devServer: {
    historyApiFallback: true,
    client: {
      logging: "error",
      overlay: { errors: true, warnings: false },
      progress: true,
      reconnect: 0,
    },
    open: true,
    port: 3002,
    hot: true, // not necessary in the latest version of webpack by default true
  },
};
