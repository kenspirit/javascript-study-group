#!/bin/bash

# Install Redis

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
rm redis-stable.tar.gz

cd redis-stable
sudo make install

echo "vm.overcommit_memory=1" | sudo tee -a /etc/sysctl.conf
# disable Transparent Huge Pages (THP)
sudo cp ./disable-transparent-hugepages /etc/init.d/
sudo chmod 755 /etc/init.d/disable-transparent-hugepages
sudo update-rc.d disable-transparent-hugepages defaults

## Prepare dirs
sudo mkdir /etc/redis
sudo mkdir /var/redis

## Set init script on boot
sudo cp utils/redis_init_script /etc/init.d/redis_6379
# sudo vi /etc/init.d/redis_6379

## Set config
sudo cp ./redis.conf /etc/redis/6379.conf
# set daemonize to yes, comment out bind address, set log file path
# vi /etc/redis/6379.conf

## Set data dir
sudo mkdir /var/redis/6379

sudo update-rc.d redis_6379 defaults

# Install MongoDB

## data: /var/lib/mongodb
## log: /var/log/mongodb
## config: /etc/mongod.conf

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update

sudo apt-get install -y mongodb-org

# Setup auto start

sudo cp ./mongodb.service /etc/systemd/system/
sudo systemctl start mongodb
sudo systemctl status mongodb
sudo systemctl enable mongodb
