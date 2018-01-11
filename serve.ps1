# Windows PowerShell script

# Remove the old transpiled files
Remove-Item .\bin\ -Force -Recurse -ErrorAction Ignore

# Make sure everything is compiled
./node_modules/.bin/tsc -p .

# Configure the reporting
$env:DEBUG = "debug-logger:*, -debug-logger:route-*"

# Start the server
node ./bin/demo-app/server.js
