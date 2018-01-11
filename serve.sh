#!/bin/bash

# Remove the old transpiled files
if [ -d ./bin/ ];
  then rm -r ./bin/;
fi;

# Make sure everything is compiled
./node_modules/.bin/tsc -p .

# Configure the reporting
export DEBUG=debug-logger:*,-debug-logger:route-*

# Start the server
node ./bin/demo-app/server.js
