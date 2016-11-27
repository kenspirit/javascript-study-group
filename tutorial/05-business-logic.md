# Node.js 微信后台搭建系列 - 业务逻辑层

[MVC]: https://en.wikipedia.org/wiki/Model–view–controller

上一章我们说到，**数据建模其实就是为后台 MVC 模式里面的 Model 建模**。那是不是 [MVC][] 的 M 就仅仅是数据模型而已？其实 M 并不仅仅包含数据模型，它还包含对数据的处理，也就是业务逻辑部分。  

那数据的处理包含什么？什么算是业务逻辑呢？我们根据脚手架生成的代码来看一下。  

## CRUD

大家可以看上次通过命令 `yo evergrow:model Image` 生成出来的文件 `image-manager.js`，里面包含这样一部分代码：

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

这些代码是什么意思呢？`image-manager.js` 这个文件其实是一个模块，它后面可以被其它模块使用。同时它也引用了安装过的全局模块 `lodash` 和我们项目本身的 `image-model` 和 `db-manager` 这个两个模块。项目本身的模块用文件相对路径来引用，全局模块只需要名字就可以了。模块的概念现在在前端非常重要，虽然这在后端已经实践很久。**分模块就是把代码分拆的足够小又不至于太小，也就是高度相关的应该放在一起，可以独立复用的就拆分**。  

`image-manager.js` 这个模块当被其它模块引用的时候，它提供了几个基础方法：`create` (C - Create), `load` (R - Read), `update` (U - Update), `remove` (D - Delete), `list` (批量 Read)。业界说的 **CRUD 其实就是对最基本的数据操作**。基本上任何系统，我们都需要 CRUD。  

## 业务逻辑

那业务逻辑是什么呢？简单来说就是基于特定的条件，才做上面的基本数据操作。比如，数据处理前的验证，不同数据模型的相关性处理等。我们要实现的随机挑选图片的操作，就是一个业务逻辑。因为它的要求是**可根据用户喜好，选择男性，女性或者任意用户上传的图片**。这里就读 Read 这个操作做了特定条件的限制。所以，我们可以在这个 `image-manager.js` 里面添加一个叫 `random` 的方法。  

```javascript
  var getRandomIntInclusive = require('../../system/util').getRandomIntInclusive

  function random(sex) {
    var params = {}
    if (sex) {
      params.sex = sex
    }

    return list(params)
      .then(function(matchedImages) {
        if (matchedImages.totalCount === 0) {
          return null
        }

        var imageToPick = getRandomIntInclusive(0, matchedImages.totalCount - 1)
        return matchedImages.records[imageToPick]
      })
  }
```

我们一起来看看这个方法。它只依赖一个可选的参数 `sex`，也就是代表用户的偏好。如果有指定，就按照指定的性别查找，没有的话就什么条件都不用了。这个方法复用了 `list` 这个批量读取的方法，然后 (then) 调用一个获取随机整数的函数，从上一步获取的所有匹配的图片中，抽取一张。  

## 延伸阅读

延伸阅读的内容不是必须掌握的部分，也不影响你完成整个项目。大概了解概念也就可以了，有兴趣可以根据相关的链接，顺藤摸瓜地探索。  

### Promise

[文档]: http://bluebirdjs.com/docs/getting-started.html
[Why Promise]: http://bluebirdjs.com/docs/why-promises.html

这个脚手架的操作，都是基于 Promise。有兴趣了解 Promise 的，可以看看我用的 bluebird 库的[文档][]。从 [Why Promise][] 看起。  

如果你目前觉得它太难，可以先不深入理解它的概念。你只要知道，你可以一直在后面接着 `then` 这样的套路也可以。`then` 其实就是**然后**的意思。`then` 的串就像是数据处理流水线一样，做完一步，拿着上一步的处理结果，再进行下一步。  

### ORM 和 Active Record

[Active Record]: https://en.wikipedia.org/wiki/Active_record_pattern

当我们的数据存放在数据库的时候，我们怎么通过编程语言来和它打交道呢？在广泛使用 RDBMS 的时候，和数据库打交道一般都是通过 SQL 来处理。但是这在后端编程语言里面嵌入使用并不是太方便，尤其表的关联处理。那么在面向对象语言的风潮里，一个叫 ORM (Object-relational mapping) 的东西出来了。它的基本目的就是帮助我们把数据库的数据，映射到编程语言里面的一个对象上面，比如 JAVA 领域的 Hibernate。ORM 主要是让开发人员可以用回通过面向对象的数据处理手段来操作数据库，比直接 SQL 这个独立的语言简单些。  

[Active Record][] 其实是一种架构模式，是 ORM 的一种特例。在 RDBMS 里，它把数据库的一个表映射到一个类上面。我们这里的情况是，`image-model.js` 里面引用的 `mongoose` 就是一个 ORM 框架，使用它可以把 MongoDB 里面的 collection 映射到一个 JavaScript 的对象里。`image-manager.js` 引用的 `ImageModel` 就是这样的一个对象。它默认带有 `create`, `update`, `remove` 等方法。我们通过操作这个对象，调用它的方法，修改它生成的新对象的属性，就可以修改数据库的值，添加或删除数据，进行数据库的操作。这种架构模式很方便，但是也有它的坏处。因为它把数据库的操作和单纯的数据对象绑定到一起，违反了单一责任的原则 (Single Responsibility Principle)，会导致不容易测试等问题。当你想单纯地创建一个数据对象的时候，你可能就要初始化依赖的数据库包。  

我这里写的 `image-manager.js` 其实把 `mongoose` 包了一层。除了统一写法外，我不想把对 `mongoose` 的依赖，把数据库的操作暴露到 MVC 的 C (Controller) 层。如果我以后不用 `mongoose`, 用回 `mongodb-native` 库，甚至要换数据库，都可以尽量降低影响面。后面讲 MVC 的 C 层时，会进一步详述怎么和 M 这一层分离。  


## 练习

我们如果要给图片加上一个状态，刚上传的图片默认是等待审核，也就是不能在 `random` 方法里面返回的。要等管理员审核通过后，才能用于交换。你能够修改相应的 Model，改 `random` 方法，和加一个 `approve` 的方法吗？  
