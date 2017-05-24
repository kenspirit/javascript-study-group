## 深入讲解数据建模

[数据建模]:https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BB%BA%E6%A8%A1

TLDR; 如果你想更深入知道 Why，这里应该能满足你的需求。如果你只是想寻找套路，知道怎么用 Generator 生成 Model，也就是 What and How，[前面一部分](./04-data-modeling.md) 就够了。  

## 数据建模

什么是[数据建模][]？Wiki 上的解释是这样的：

>在软件工程中，数据建模是运用正式的数据建模技术，建立信息系统的数据模型的过程。  
>......  
>一个概念数据模型的实现可能需要多个逻辑数据模型。数据建模中的最后一步是确定逻辑数据模型到物理数据模型中到对数据，访问，性能和存储的具体要求。数据建模定义的不只是数据元素，也包括它们的结构和它们之间的关系。  

这里强调的是在软件工程中的解释，因为它和数据分析领域的建模不太一样。**数据建模其实就是为后台 MVC 模式里面的 Model 建模**。小到一个功能，大到整个系统，数据建模的重要性都不容置疑。所以希望大家能认真结合实际项目理解清楚。上面的定义和解释比较抽象，但是每个词都可圈可点，尤其是第二段值得大家细细品味，我们通过下面的例子来说明一下。  

假如现在你要实现的系统，需要存储用户上传的图片，然后可以在要实现的图片交换功能上使用。那我们来想想，这个数据模型要怎么建立？  

### 从归属和分区考虑

首先，应该不难理解，下面两大信息是要记录的。

* 上传图片的用户信息  
* 图片信息  

有没有说了等于白说的感觉？别着急。  

#### 用户信息

一般来说，每个系统都要求用户必须注册后才能够操作。用户信息通常每个系统都存在，不论你是帐号密码登录，还是微博，微信登录等。  

[Evergrow]: https://github.com/kenspirit/generator-evergrow

在用脚手架 [Evergrow][] 一键生成的系统里面，已经有现成的 User Model，在文件 `user-model.js` 里面。本教程使用的是 Node.js 系统一般会用到的 MongoDB 来存储数据。`mongoose` 是数据库的 `client`。后端编程无论什么语言，如果需要操作数据库，都必须有相应语言的 client 才行。  

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

从上面看到，User Model 有登录帐号 `loginId`，电话 `phone`，邮箱 `email`，密码 `password` 等其它信息。你可以猜出什么字段是必须有数据的，分别是什么数据类型，哪些是系统必须唯一（不允许重复的）。当前的模型完全没有任何放微信信息的地方，等我们讲到和微信集成的时候，会回头来看怎么修改。  

#### 图片信息

用户信息已经有地方存了，那图片信息应该放什么地方？  

* 和用户信息放一起  
* 另外建立一个模型  

有计算机基础的同学可能觉得第一个选择太愚蠢。但是，不一定每次的选择都那么明显的。**数据怎么放由什么决定？**最基本两点需要考虑的是：**数据的关系**和**存储系统的特点**。

[数据库设计范式]:https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A7%84%E8%8C%83%E5%8C%96

从数据角度考虑，可以说图片信息属于用户，因为是用户上传的，就像是文章的评论属于文章。而且，它们的关系是一对多的关系。一个用户可以多次上传图片，一篇文章可以有很多评论。如果我们是使用关系型数据库（如 Oracle, MySQL 等），一对多关系的数据一般都分开独立的表存储才符合[数据库设计范式][]。这里不细说，有兴趣自己查看。  

从存储系统的特点来考虑，MongoDB 是**文档型数据库**，它可以存储复杂 JavaScript Object 对象，支持层级嵌套，我们其实可以把从属关系的数据都放一起。  

那我们要不要把图片信息塞到 User Model 里面呢？不行，主要有两个原因：

1. 太深入嵌套的数据在 MongoDB 查找不方便。后期我们可能要单独查找 Image Model 的数据，因为要随机挑图片。  

2. 图片和用户的关系不像是车轮和汽车的关系，有限并可控。图片的数量是可以无限增长的。MongoDB 里面一个文档不能存太大的数据，所以不适合放一起。  


### 从功能，性能考虑

既然我们决定了图片数据要分开另一个模型来存储，那它像实操部分那样够不够呢？  

```javascript
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema

  var ImageSchema = new Schema({
    url: {type: String, required: true},
    width: Number,
    height: Number,
    createdUser: {type: String, required: true},
    updatedUser: {type: String, required: true},
    deleted: {type: Boolean, default: false}
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

  module.exports = mongoose.model('Image', imageSchema)
```

似乎差不多了，但是，应该要再加一个 `userId`。通过一个和 User Model 关联的唯一 ID，才能确切标记是哪个用户上传的图片。  

最后，如果你玩过和菜头公众号的图片交换功能，它可以让你选择你随机拿到的图片是男用户，女用户，或者任何用户上传的。那这个性别信息我们应该放什么地方？性别本来是属于用户信息的一部分，理应存在 User Model。但是，从功能和性能考虑，需要作出一点点调整。  

为什么呢？如果我们用的是关系型数据库，在不违反设计范式的情况下，性别应该放在存放用户信息的地方。在需要查询使用的时候，可以把放图片信息的表和用户信息表关联起来。但是，MongoDB 是不支持两个表（在 MongoDB 里面叫 Collection）关联的。如果你把性别的字段只是放在 User Model，那么要实现这个功能的时候，就要先查一下 User 那边看哪些是满足性别的用户，后头再去找 Image 看这些用户有什么图片，然后随机拿一个出来。如果把性别放在 Image Model，那就只看一个地方就可以了。  

这种做法叫**数据冗余**。如果把它用在关系型数据库里，其实不符合范式。但是在 MongoDB 里面比较常需要用到这种做法。  


## 总结与练习

[编程是什么？我要学吗？]: http://www.thinkingincrowd.me/2016/08/28/What-is-programming-should-I-learn/
[Tasting JavaScript]: http://leanpub.com/tasting-javascript

数据模型在编程领域可谓是最重要的部分了。正如以前我在「[编程是什么？我要学吗？][]」里面提到：**Algorithms + Data Structures = Programs**。我的「[Tasting JavaScript][]」第 4 章也摘录了首届图灵奖的获得者 Alan J. Perlis 说过的一句话：  

>It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures.  
>    --  Alan J. Perlis

可见，一个好的数据结构是多么重要。所以，我建议你根据上面提到的两大角度，**从归属和分区考虑**，**从功能，性能考虑**，时不时回顾你的数据模型，看是否合理和高效。  

学习完这一章，你不妨想一想你打算实现的系统功能，它的数据模型应该要怎么样设计。可以提一个 Issue 来讨论一下。  
