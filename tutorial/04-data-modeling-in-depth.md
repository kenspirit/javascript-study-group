## 深入讲解数据建模

[数据建模]:https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BB%BA%E6%A8%A1

TLDR; 如果你想更深入知道 Why，这里应该能满足你的需求。如果你只是想寻找套路，知道怎么用 Generator 生成 Model，也就是 What and How，[前面一部分](./04-data-modeling.md) 就够了。  

## 数据建模

什么是[数据建模][]？Wiki 上的解释是这样的：

>在软件工程中，数据建模是运用正式的数据建模技术，建立信息系统的数据模型的过程。  
>......  
>一个概念数据模型的实现可能需要多个逻辑数据模型。数据建模中的最后一步是确定逻辑数据模型到物理数据模型中到对数据，访问，性能和存储的具体要求。数据建模定义的不只是数据元素，也包括它们的结构和它们之间的关系。  

这里强调的是在软件工程中的解释，因为它和数据分析领域的建模不太一样。**数据建模其实就是为后台 MVC 模式里面的 Model 建模**。小到一个功能，大到整个系统，数据建模的重要性都不容置疑。所以希望大家能认真结合实际项目理解清楚。Wiki 上面的定义和解释比较抽象，但是每个词都可圈可点，尤其是第二段值得大家细细品味，我们通过下面的例子来说明一下。  

我们要实现的系统，需要存储用户上传的图片，而且可以实现图片交换的功能。那我们来想想，这个数据模型要怎么建立？  

### 从归属和分区考虑

首先，应该不难理解，下面两大信息是要记录的。

* 上传图片的用户信息  
* 图片信息  

有没有说了等于白说的感觉？别着急。  

#### 用户信息

一般来说，每个系统都要求用户必须注册后才能够操作。用户信息通常每个系统都存在，不论你是帐号密码登录，还是微博，微信登录等。  

[Evergrow]: https://github.com/kenspirit/generator-evergrow

在用脚手架 [Evergrow][] 一键生成的系统里面，已经有现成的 User Model，在目录文件 `/module/user/user-model.js` 里面。  

```javascript
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var userSchema = new Schema({
    loginId: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    emailResetId: String,
    deleted: {type: Boolean, default: false}
  }, {strict: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

  module.exports = mongoose.model('User', userSchema)
```

从上面看到，User Model 有登录帐号 `loginId`，电话 `phone`，邮箱 `email`，密码 `password` 等其它信息。你可以猜出什么字段是必须有数据的，分别是什么数据类型，哪些是系统必须唯一（不允许重复的）。_当前的模型完全没有任何放微信信息的地方，等我们讲到和微信集成的时候，会回头来看怎么修改。_  

前面说过，`mongoose` 是帮我们通过代码来操作 MongoDB 的工具。用更准确的定义来说，它是数据库在 Node.js 环境下的 `client`。后端编程无论什么语言，如果需要操作数据库，都必须有相应语言的 client 才行。

#### 图片信息

用户信息已经有地方存了，那图片信息应该放什么地方？  

* 和用户信息放一起  
* 另外建立一个模型  

有计算机基础的同学可能觉得第一个选择太愚蠢。但是，不一定每次的选择都那么明显的。  

**数据怎么放由什么决定？**最基本两点需要考虑的是：**数据的关系**和**存储系统的特点**。

[数据库设计范式]:https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A7%84%E8%8C%83%E5%8C%96

* 从数据角度考虑

图片信息属于用户，因为是用户上传的，就像是文章的评论属于文章。而且，它们的关系是一对多的关系。一个用户可以多次上传图片，一篇文章可以有很多评论。如果我们是使用关系型数据库（如 Oracle, MySQL 等），一对多关系的数据一般都分开独立的表存储才符合[数据库设计范式][]。这里不细说，有兴趣的朋友自己加餐吧。  

* 从存储系统的特点考虑

MongoDB 是**文档型数据库**，它可以存储复杂 JavaScript Object 对象，支持层级嵌套，我们其实可以把从属关系的数据都放一起。  

那我们要不要把图片信息塞到 User Model 里面呢？不行，主要有两个原因：

1. 太深入嵌套的数据在 MongoDB 查找不方便。后期我们可能要单独查找 Image Model 的数据，因为要随机挑图片。  

2. 图片和用户的关系不像是车轮和汽车的关系，有限并可控。图片的数量是可以无限增长的。MongoDB 里面一个文档不能存太大的数据，所以不适合放一起。  


### 从功能，性能考虑

我们既然决定了图片数据要分开另一个模型来存储，那它像实操部分那样设计有没有问题呢？  

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

  module.exports = mongoose.model('Image', imageSchema)
```

用户性别信息应该放在这里吗？它不是属于用户信息的一部分，理应存在 User Model 的吗？  

如果我们用的是关系型数据库，在不违反设计范式的情况下，性别是应该放在存放用户信息的地方。在需要查找特定性别的用户发的图片的时候，可以通过用户的 ID（我们在实操时以为没用，删除了的 createdUserId 和 updatedUserId 字段）把放图片信息的表和用户信息表关联起来。  

但是，因为我们用的是 MongoDB，从功能和性能考虑的话，要作出一点点调整，不能像用关系型数据库那样完全遵守范式。  

这里的做法叫**数据冗余**。也就是我们可以把某一些数据，同时放不同的地方。  

为什么呢？因为 MongoDB 并不支持两个表（在 MongoDB 里面叫 Collection）关联的。如果你只是把性别的字段存放在 User Model，那么，要根据性别过滤图片的时候，就必须先找出特定性别的用户，回头根据上一步获取的用户 ID 再去过滤图片。尤其在数据量大的情况下，这么做效率不高。  


## 总结

[编程是什么？我要学吗？]: http://www.thinkingincrowd.me/2016/08/28/What-is-programming-should-I-learn/
[Tasting JavaScript]: http://leanpub.com/tasting-javascript

数据模型在编程领域可谓是最重要的部分了。正如以前我在「[编程是什么？我要学吗？][]」里面提到：**Algorithms + Data Structures = Programs**。我的「[Tasting JavaScript][]」第 4 章也摘录了首届图灵奖的获得者 Alan J. Perlis 说过的一句话：  

>It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.  
>    --  Alan J. Perlis

可见，一个好的数据结构是多么重要。所以，我建议你根据上面提到的两大角度，**从归属和分区考虑**，**从功能，性能考虑**，时不时回顾你的数据模型，看是否合理和高效。  

学习完这一章，你不妨想一想你打算实现的系统功能，它的数据模型应该要怎么样设计。可以提一个 Issue 来讨论一下。  
