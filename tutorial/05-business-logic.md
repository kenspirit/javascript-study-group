# Node.js 微信后台搭建系列 - 业务逻辑

[MVC]: https://en.wikipedia.org/wiki/Model–view–controller

上一章加餐部分说到，**数据建模其实就是为后台 MVC 模式里面的 Model 建模**。那是不是 [MVC][] 的 M 就仅仅是数据模型而已？其实 M 并不仅仅包含数据模型，它还包含对数据的处理，也就是业务逻辑部分。  

那数据的处理包含什么？什么算是业务逻辑呢？我们根据脚手架生成的代码来看一下。  

## CRUD

上次通过命令 `yo evergrow:model Image` 生成出来的文件 `image-manager.js`，里面包含这样一部分代码：

```javascript
  var _ = require('lodash')
  var ImageModel = require('./image-model')
  var executeQuery = require('../../system/db-manager').executeQuery

  module.exports = {
    list: list,
    load: load,
    create: create,
    update: update,
    remove: remove
  }
```

上面代码的前三句是模块引用。有全局模块 `lodash` 和项目本身的 `image-model` 和 `db-manager`。项目本身的模块以文件相对路径来引用，全局模块就只需要名字。  

其实，写代码和搭乐高积木差不多。代码的一个变量，一个函数，可以看作是一个乐高的最小元件。每一个 JavaScript 文件，就像是乐高的一个小人，小车或小屋。最后我们实现的整个 Node.js 项目，就是整个宏大的乐高场景。  

我们引用模块其实和寻找合适的积木是一样的。通过把自己写的，别人已经拼好的，进行恰当的组合，就可以完成千变万化的作品。  

`image-manager.js` 本身这个模块被其它模块引用的时候，包括它声明的几个基础方法：`create` (C - Create), `load` (R - Read), `update` (U - Update), `remove` (D - Delete) 和 `list` (批量 Read)。业界说的 **CRUD 其实就是最基本的数据操作**。任何系统，我们都需要 CRUD。任何业务逻辑代码，都是 CRUD 的基础上演变的。  


## 业务逻辑

顾名思义，业务逻辑就是满足系统业务功能的处理逻辑。比如，数据处理前的验证，不同数据模型的关系处理等。放到我们这个微信后台，随机交换图片这个功能就是业务逻辑。  

下面我们就来看看如何从数据库里面随机抽取一张图片出来。  

打开文件 `module/image/image-manager.js`：

* 在文件顶端引入系统内部一个帮助函数 `getRandomIntInclusive`  
* 添加一个名字叫 `random` 的方法到最后  
* 修改 `module.exports`，把 `random` 方法导出。也就是说声明这个方法可以被其它地方引用。  

修改后的文件内容如下：  

```javascript
  var executeQuery = require('../../system/db-manager').executeQuery
  var getRandomIntInclusive = require('../../system/util').getRandomIntInclusive

  module.exports = {
    list: list,
    load: load,
    create: create,
    update: update,
    remove: remove,
    random: random
  }

  // 为了节省空间，这里省略中间本来已经有的 list, load 等函数

  function random(gender) {
    var params = {}
    if (gender) {
      params.gender = gender
    }

    return list(params) // 根据 params 提供的条件，批量从数据库获取图片信息
      .then(function(matchedImages) {
        if (matchedImages.totalCount === 0) {
          return null
        }

        var imageToPick = getRandomIntInclusive(0, matchedImages.totalCount - 1) // 从那么多图片当中，随便选了一个数字
        return matchedImages.records[imageToPick] // 返回选中的幸运儿
      })
  }
```

这里有一个点要特别说明一下，是那个 `then`。  

虽然 `then` 的意思是“xxx 做完了，然后（then）做什么”，似乎和我们平时一行行顺着写的代码是一样的意思嘛。但是，它们有很大不同。平时那些代码的操作，只是一些纯粹的计算，更改的也是内存的数据。但是 `list(params)` 这个方法却是要等它去数据库找一遍才行。这个特殊的操作，和读写文件，请求网络等被统称为**异步操作**。要拿异步操作返回的数据来用，是不能简单用我们熟悉的 `=` 号的。默认提供的的 CRUD 方法，都需要这种操作方式。  


## 例子

如果我说，用户刚上传的图片，也就是刚创建的图片，必须等待审核。在没有审核通过前，图片不能从之前写的 `random` 方法返回。我们应该怎么做呢？  

### 添加状态字段  

因为图片新增了状态信息，我们就需要在我们的模型添加一个状态字段。`/module/image/image-model.js` 可以修改如下：  

```javascript
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var ImageSchema = new Schema({
    url: {type: String, required: true},
    gender: String,
    width: Number,
    height: Number,
    status: {type: String, default: 'P'}, // 新增一个字段。有效的值为 'P' 或 'A'，分别代表审核中和已通过
    createdUser: {type: String, required: true},
    updatedUser: {type: String, required: true},
    deleted: {type: Boolean, default: false}
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

  module.exports = mongoose.model('Image', ImageSchema)
```

然后，我们添加一个新的 `approve` 方法到 `/module/image/image-manager.js` 的最后，并在 `module.exports` 声明可导出使用：  

```javascript
  // 为了节省空间，这里省略模块引用部分

  module.exports = {
    list: list,
    load: load,
    create: create,
    update: update,
    remove: remove,
    random: random,
    approve: approve
  }

  // 为了节省空间，这里省略中间本来已经有的 list, load 等函数

  function approve(imageId) {
    return update({
      _id: imageId,
      status: 'A'
    })
  }
```

其实 `approve` 方法做了很少的事情。它只需要根据提供的图片 ID，调用已有的 `update` 方法更新 `status` 字段就可以了。（ MongoDB 里面的数据保存 ID 的字段默认为 `_id` ）。  

最后，`random` 再做一个小的改动就可以了。  

```javascript
  function random(gender) {
    var params = {
      status: 'A' // 默认查询条件设为：status 字段的值为 'A'
    }

    if (gender) {
      params.gender = gender
    }

    return list(params) // 根据 params 提供的条件，批量从数据库获取图片信息
      .then(function(matchedImages) {
        if (matchedImages.totalCount === 0) {
          return null
        }

        var imageToPick = getRandomIntInclusive(0, matchedImages.totalCount - 1) // 从那么多图片当中，随便选了一个数字
        return matchedImages.records[imageToPick] // 返回选中的幸运儿
      })
  }
```

更多关于异步操作的介绍，请查看「提升小宇宙」部分。  


## 练习

加一个名为 `reject` 的方法并导出。它的作用和 `approve` 相反，要把图片的状态信息修改为 'R'。  


## 提升小宇宙

别复制粘贴，把上面的方法自己敲几次。当你能自己写出上面的代码后，可以再深入学习
[异步操作，和自动化测试](./05-business-logic-in-depth.md)  
