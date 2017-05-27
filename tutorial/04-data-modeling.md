# Node.js 微信后台搭建系列 - 数据建模

数据建模，好高大上的名字啊。简单来说，就是为了系统要存储的数据，设计它的结构。还是不懂？就是想好你要存储的数据，包含什么信息，怎么存。  

既然我们的系统要存储用户上传的图片，那肯定要设计一个关于图片信息的模型。  

## 实现步骤

回到 [Web App 骨架](./02-boilerplate.md) 那一章生成了项目脚手架的目录下，执行一句命令：  

>yo evergrow:model Image

命令最后的 `Image` 代表模块的名字。命令运行之后，你会看到它提醒你生成的目录和文件。  

```bash
  create module/image/image-routes.js
  create module/image/image-model.js
  create module/image/image-manager.js
  create module/image/image-controller.js
  create test/int/image/manager.js
```

上面的命令其实已经生成 Image 模块的后台基本模板。目前你只需要重点看 `module/image/image-model.js` 就好了。后面的章节会再详细说明其它文件有什么用。  

`image-model.js` 里面的内容模板是下面这样的。你可以根据单词意思猜它们的作用，但不理解也没关系，先不用太深究为什么这么写。虽然说这就是很多人喜欢的**套路**，但是，其实学会猜代码也是非常重要的能力。  

```javascript
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var ImageSchema = new Schema({
    createdUserId: {type: Schema.Types.ObjectId, required: true},
    createdUser: {type: String, required: true},
    updatedUserId: {type: Schema.Types.ObjectId, required: true},
    updatedUser: {type: String, required: true},
    deleted: {type: Boolean, default: false}
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

  module.exports = mongoose.model('Image', ImageSchema)
```

既然要保存图片信息，我们应该要加上 `url`，`width` 和 `height` 字段来分别存储图片的路径，宽和高吧？再加上前面说我们可能要根据用户性别来找图片，那应该还要加一个 `gender` 字段来表示图片上传者的性别。 createdUserId 和 updatedUserId 这两个必须提供数据的字段，目前暂时用不上，也影响我们测试，所以就先删除了。修改后文件内容应该是这个样子：  

```javascript
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var ImageSchema = new Schema({
    url: {type: String, required: true},
    gender: String,
    width: Number,
    height: Number,
    createdUser: {type: String, required: true},
    updatedUser: {type: String, required: true},
    deleted: {type: Boolean, default: false}
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

  module.exports = mongoose.model('Image', ImageSchema)
```

有一些同学，看到不懂的单词或者东西就不太舒服。我也简单说一下上面代码里一些关键的东西是有什么作用吧。  

1. `mongoose` 是帮我们通过代码来操作 MongoDB 的工具，我们通过 `require` 的方式来使用它。MongoChef，命令 `mongo` 也是操作 MongoDB 的工具，只不过一个通过界面，一个通过命令。  

2. `Schema` 其实就是规范了我们的数据存储格式，类型和结构。  

3. 最后一句是把这个数据模型命名为 `Image`，MongoDB 数据库会根据这个名字，把数据存储到 `images` 的空间。不少人看不到实际数据还是会有点迷惑，我们来添加一点数据看看吧。  


## 添加测试数据

首先，启动 MongoDB 和 Redis 服务。然后，在项目脚手架的目录下，执行下面的命令来启动项目：  

>node index.js

### 通过系统 API 和代码的调用来添加数据。  

Mac 环境下，复制下面的命令，粘贴到另一个新开的命令行窗口，并按 Enter 执行（末尾的 \ 是需要的。Windows 用户需要去下载安装 curl）：  

```
  curl -X POST http://localhost:3000/image \
    --data "url=hello.jpg" \
    --data "createdUser=ken" \
    --data "updatedUser=ken" \
    --data "gender=M" \
    --data "width=100"
```

运行正常后应该能看到下图。  

![Add Data - curl](./images/04-data-modeling-add-data-curl.png)

### 通过 mongo 命令来添加数据。  

新开一个命令行窗口，然后执行以下命令连接到 MongoDB 服务。  

>mongo

然后依次执行下面两个命令：  

>use app

>db.images.insert({ url: 'world.jpg', gender: 'F', createdUser: 'winnie', updatedUser: 'winnie', height: 100 });

运行正常后应该能看到下图。  

![Add Data - mongo](./images/04-data-modeling-add-data-mongo.png)

最后，我们可以在 MongoChef 看到不同方式添加的数据有什么区别。通过代码添加的，会额外补充了一些默认的数据。那些默认数据是 `mongoose` 通过我们提供的 `Schema` 来实现的。  

![View Data](./images/04-data-modeling-view-data.png)


## 提升小宇宙

如果你力有余，[深入讲解数据建模](./04-data-modeling-in-depth.md) 能让你从更全面的角度来理解数据建模。  
