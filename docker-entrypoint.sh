#!/bin/sh

echo 'Setting environment variables... '

VUE_APP_CONNECT_SERVER=$VUE_APP_CONNECT_SERVER
VUE_APP_REST_SERVER=$VUE_APP_REST_SERVER

echo 'VUE_APP_CONNECT_SERVER: ' $VUE_APP_CONNECT_SERVER
echo 'VUE_APP_REST_SERVER: ' $VUE_APP_REST_SERVER

if [ -f "$VUE_APP_CONNECT_SERVER" ]
then 
    echo "$VUE_APP_CONNECT_SERVER" >> ".env.production"
fi

if [ -f "$VUE_APP_REST_SERVER" ]
then 
    echo "$VUE_APP_REST_SERVER" >> ".env.production"
fi

echo 'Building Kafka Manager...'
npm i
npm run build

echo 'Starting Kafka Manager...'
node server.js
