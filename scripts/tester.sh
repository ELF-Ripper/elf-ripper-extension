#!/bin/bash

# Install all the required dependencies from package.json
npm install

# Clean the project before installing dependencies
npm run clean

# Run the tests
# The following command runs the 'pretest' script, which first runs ESLint for linting (checking code for errors) 
# and then compiles the TypeScript tests. After that, Jest is executed to run the actual tests.
npm test