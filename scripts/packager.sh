#!/bin/bash

# Install all the required dependencies from package.json
npm install

# Clean the project before installing dependencies
npm run clean

# Add the 'vsce' package from node_modules to the PATH environment variable
export PATH=$PATH:/workspace/node_modules/@vscode/vsce

# Package the VSCode extension,
# It first runs the 'vscode:prepublish' script, which builds the extension using webpack in production mode.
# The output is a packaged .vsix file, ready to be published or installed
vsce package