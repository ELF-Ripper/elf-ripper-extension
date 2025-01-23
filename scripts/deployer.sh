#!/bin/bash

# Install all the required dependencies from package.json
npm install

# Clean the project before installing dependencies
npm run clean

# Add the 'vsce' package from node_modules to the PATH environment variable
export PATH=$PATH:/workspace/node_modules/@vscode/vsce

# Publish the VSCode extension using the PAT
vsce publish --pat "$1"
