#!/bin/bash

# Install Nginx

wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key

echo "deb http://nginx.org/packages/ubuntu/ trusty nginx" | sudo tee -a /etc/apt/sources.list
echo "deb-src http://nginx.org/packages/ubuntu/ trusty nginx" | sudo tee -a /etc/apt/sources.list

sudo apt-get update
sudo apt-get install -y nginx

sudo cp ./app.conf /etc/nginx/conf.d

# Install Node.js 6.x

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo apt-get install -y node-gyp

# download node source for node-gyp
node-gyp install --dist-url https://npm.taobao.org/mirrors/node


# Install NPM & PM2
sudo apt-get install -y npm
sudo npm install -g pm2
