const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Common configuration shared between React app and VSCode extension builds
const commonConfig = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Resolve these extensions for imports
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Apply rule to TypeScript files
        use: "babel-loader", // Use Babel to transpile TypeScript
        exclude: /node_modules/, // Exclude node_modules from transpilation
      },
      {
        test: /\.css$/, // Apply rule to CSS files
        use: ["style-loader", "css-loader", "postcss-loader"], // Loaders to handle CSS
      },
    ],
  },
  externals: {
    vscode: "commonjs vscode", // Exclude the vscode module from the bundle
  },
};

// React App (Client Side) configuration
const reactAppConfig = {
  ...commonConfig,
  mode: "production", // Set mode to production for optimization
  entry: {
    dashboard: "./src/app/dashboard.tsx", // Entry point for the dashboard
    panel: "./src/app/panel.tsx", // Entry point for the panel
  },
  output: {
    path: path.resolve(__dirname, "dist", "public"), // Output directory for the built files
    filename: "[name].bundle.js", // Output filename for the React app bundle
    libraryTarget: "umd", // Universal Module Definition for browser compatibility
  },
  target: "web", // Target environment is web browsers
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html", // HTML template for the React app
      filename: "dashboard.html", // Output HTML file for the dashboard
      chunks: ["dashboard"], // Include only the dashboard chunk
      inject: "body", // Inject script tags into the body
      favicon: "./src/app/assets/cpu.svg", // Favicon for the app
    }),
    new HtmlWebpackPlugin({
      template: "./src/app/index.html", // HTML template for the React app
      filename: "panel.html", // Output HTML file for the panel
      chunks: ["panel"], // Include only the panel chunk
      inject: "body", // Inject script tags into the body
      favicon: "./src/app/assets/cpu.svg", // Favicon for the app
    }),
  ],
};

// VSCode Extension Logic configuration
const vscodeExtensionConfig = {
  ...commonConfig,
  mode: "production", // Set mode to production for optimization
  entry: "./src/client/extension.ts", // Entry point for the VSCode extension
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for the extension bundle
    filename: "extension.bundle.js", // Output filename for the extension bundle
    libraryTarget: "umd", // Universal Module Definition for VSCode environment
  },
  target: "node", // Target environment is Node.js
};

module.exports = [reactAppConfig, vscodeExtensionConfig];
