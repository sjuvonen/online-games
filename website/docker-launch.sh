#!env sh

# Note: this script must be executed from the root of the Angular workspace.

if [ ! -d "node_modules/@angular" ]; then
  npm install
fi

exec npx ng serve --host 0.0.0.0 --port 4200 --ssl --disable-host-check --proxy-config proxy.config.json
