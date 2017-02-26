## Node.js & NPM

Node.js 可以安装 6.3.1 的版本。不安装最新的 LTS 版本是因为它使用 node-inspector 会有问题，这个工具是以后有需要 debug 的时候用的。安装 nvm 有麻烦的，可以不用装它。直接上官网下载对应的版本来安装吧。

安装网址：https://nodejs.org/download/release/v6.3.1/

Windows 64bit 机器：
node-v6.3.1-x64.msi 

Windows 32bit 机器：
node-v6.3.1-x86.msi

安装完以后，升级一下 NPM。在命令行输入以下命令：

>npm install npm@latest -g

## MongoDB

Community Server 在这里下载：https://www.mongodb.com/download-center?jmp=hero#community

官方安装教程：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

Window Hotfix 安装：https://support.microsoft.com/en-us/kb/2731284

基本步骤：

**安装**  

双击下载的 .msi 文件

**设置数据目录**  

默认 MongoDB 会把数据放在这里 `\data\db`。所以，你先创建一个目录：

>md \data\db

**启动 MongoDB 数据库**

>mongod.exe

**测试连接 MongoDB**

安装并使用 MongoChef  

[MongoChef](./01-environment-mongochef.md)

## Redis

下载安装指南：http://redis.io/download

在 https://github.com/MSOpenTech/redis/releases 下载 Redis-x64-3.2.100.msi 文件，双击安装。

启动服务器命令：  

>redis-server.exe

连接服务器命令：  

>redis-cli.exe
