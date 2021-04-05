#!env sh

if [ ! -d "/app/colibre/cms" ]; then
  curl -L https://github.com/sjuvonen/colibre/archive/refs/heads/master.zip -o /app/colibre.zip
  unzip -o /app/colibre.zip -d /app
  mv /app/colibre-master/* /app/colibre

  for d in /app/colibre/*/;
  do
    bash -c "cd ${d} && npm i"
  done

  rm -rf /app/colibre-master
  rm /app/colibre.zip
fi

if [ ! -f "node_modules/@colibre" ]; then
  npm install
fi

exec npm run start
