## Node.js & NPM

Node.js 可以安装 6.3.1 的版本。不安装最新的 LTS 版本是因为它使用 node-inspector 会有问题，这个工具是以后有需要 debug 的时候用的。安装 nvm 有麻烦的，可以不用装它。直接上官网下载对应的版本来安装吧。

下载网址：https://nodejs.org/download/release/v6.3.1/

双击下载的文件 node-v6.3.1.pkg 安装。完成后在命令行输入以下命令安装 NPM：

>npm install npm@latest -g

## MongoDB

**安装**  

* 用 brew 安装：  

  >brew install mongodb

* 手动安装：  

  * 在命令行进入你想放 MongoDB 的目录，把 <folder_name> 换成如 `~/tutorial_test` ：  

    >cd <folder_name>

  * 下载：  

    >curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.2.10.tgz

  * 解压：  

    >tar -zxvf mongodb-osx-x86_64-3.2.10.tgz

  * 改个短点的名字：

    >mv mongodb-osx-x86_64-3.2.10/ mongodb

**设置数据目录**  

* 默认 MongoDB 会把数据放在这里 `/data/db`。所以，你先创建一个目录（要输入你的密码）：  

  >sudo mkdir -p /data/db

* 设置好权限  

  >sudo chmod -R 777 /data/db

**启动 MongoDB 数据库**

* 在 MongoDB 的安装目录依次输入下面的命令

  >cd mongodb/bin

  >./mongod

敲完上面的命令，你应该能看到如下 MongoDB 启动成功的画面：

![MongoDB](http://thinkingincrowd.u.qiniudn.com/01-environment-mac-mongodb.png)


**高级用法（Homebrew 安装方式不需要）**

* 把可执行命令放到你的个人配置，根据你自己的编辑器，选择下面合适的命令：  

  Atom:  

  >atom ~/.bashrc

  Sublime:  

  >ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/local/bin/subl
  >subl ~/.bashrc

  把下面这行加到最下面，然后保存推出：  

  >export PATH=<mongodb-install-directory\>/bin:$PATH

  _<mongodb-install-directory\> 要替换成你的 mongodb 放的位置。在那个目录下，打 `pwd` 就可以得到。_

**测试连接 MongoDB**

安装并使用 [MongoChef](./01-environment-mongochef.md)  


## Redis

打开一个新的命令行窗口

**安装**  

* 在命令行进入你想放 MongoDB 的目录，把 <folder_name> 换成如 `~/tutorial_test` ：  

  >cd <folder_name>

* 下载：  

  >curl -O http://download.redis.io/releases/redis-3.2.8.tar.gz

* 解压：  

  >tar -zxvf redis-3.2.8.tar.gz

* 改个短点的名字：

  >mv redis-3.2.8/ redis

* 进入目录并安装：  

  >cd redis

  >make

**启动 Redis 数据库**

* 在 Redis 的安装目录输入下面的命令

  >src/redis-server

敲完上面的命令，你应该能看到如下 Redis 启动成功的画面：

![Redis](http://thinkingincrowd.u.qiniudn.com/01-environment-mac-redis.png)

**测试连接 Redis**

连接服务器命令：  

>redis-cli.exe

或者用图形化工具：  

Medis: https://github.com/luin/medis
