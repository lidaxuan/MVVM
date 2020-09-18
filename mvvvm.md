MVVM 是一种模式,实际应用呢 就是咱们的vue, 实现了数据绑定与模板渲染,

MVVM框架

+ MVVM（Model-View-ViewModel）是对 MVC（Model-View-Control）和 MVP（Model-View-Presenter）的进一步改进。
  + model: 数据层（存储数据及对数据的处理如增删改查）
  + view: 视图层（UI 用户界面）
  + ViewModel: 业务逻辑层( 指的就是一切js 都可以看成是业务逻辑 )
+ 思想  : MVVM将数据进行双向绑定(`data-binding`)作为核心思想，View 和 Model 之间没有联系，它们通过 ViewModel 这个桥梁进行交互。
+ Model 和 ViewModel 之间的交互是双向的，因此 View 的变化会自动同步到 Model，而 Model 的变化也会立即反映到 View 上显示。
+ 当用户操作 View，ViewModel 感知到变化，然后通知 Model 发生相应改变；反之当 Model 发生改变，ViewModel 也能感知到变化，使 View 作出相应更新。

![WeChat6206b7380136fae925d47027a8ae9a21](/Users/lidaxuan/lidaxuan/project/vue知识/mvvm/img/WeChat6206b7380136fae925d47027a8ae9a21.png)

+ ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

**优点**:

1. 可重用性。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 View 重用这段视图逻辑

 	2. 独立开发。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计  不像以前使用jQuery 及得关注数据,还得操作DOM,比较繁琐
 	3. 方便测试。界面素来是比较难于测试的，开发中大部分 Bug 来至于逻辑处理，由于 ViewModel 分离了许多逻辑，可以对 ViewModel 构造单元测试。
 	4. 易用 灵活 高效



咱们简单来实现一下 

![WeChata277d5117523670a8e8451c4b2d9f1a0](/Users/lidaxuan/lidaxuan/project/vue知识/mvvm/img/WeChata277d5117523670a8e8451c4b2d9f1a0.png)

1. 体验一下vue的使用

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <input type="text" v-model="name">
    <br>
    这是输入框的内容: {{name}}
  </div>
  <script src="./vue.js"></script>
  <script>
    const vm = new Vue({
      el: '#app',
      data: {
        name: ''
      }
    })

  </script>
</body>
</html>
```



1. 实现mvvm

   2.1 模板的编译 也就是 v-model 与 {{}} 插值表达式

   2.2数据劫持 观察数据变化 (vue中 使用的方法, object.defineProperty  get 和 set)

   2.3 watch 数据变化

2. 创建index.html 

```js
let vm = new MVVM({
      el: '#app', // document.getElementById('app');
      data: {
        name: '李大玄',
        form: {
          a: 'da',
          b: {
          	c: 1
        	}
        }
      }
    });
```

3. 创建 mvvm.js

```js
class Mvvm extends Object {
  constructor({el, data}) { // options
    super();
    this.$el = el;
    this.$data = data;

    if (this.$el) { // 如果用户传元素进来了 咱们讲页面上的东西先渲染出来
      // 也就是编译出咱们想要的结果
      new Compile(this.$el, this.$data);
    }
  }
}
```

4. 创建 compile 文件  这样就可以实现输入框数据回显了

```js
class Compile {
  // vm --> 实例
  constructor(el, vm) {
    this.el = this.isNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    

    if (this.el) { // 是 最外层元素 但是咱们需要将内部元素进行塞进去
      // 写一个方法 将元素写进内存中
      // 文档碎片
      const fragment = this.nodeToFrogmen(this.el);
      console.log(this.el);
      // 见名思意 编译  
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }

  
  // 第一个方法 判断是不是一个node节点
  isNode(node) {
    return node.nodeType === 1;
  }

  // 第六个方法
  isDricetive(name) {
    return name.includes('v-'); // es7 方法
  }

  // 第二个方法
  nodeToFrogmen(node) {
    // 如果 有元素的话 咱们讲节点放到内存中去处理 原因就是快
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  // 第三个方法
  compile(fragment) {
    let childNodes = fragment.childNodes; // 从内存中获取出node节点
    console.log(childNodes); // 一个数组
    Array.from(childNodes).forEach(node => {
      if (this.isNode(node)) { // node 节点
        this.compileElement(node);
        this.compile(node); // 递归 获取深层节点
      } else { // 文本节点
        this.compileText(node);
      }
    }) 
  }

  // 第四个方法
  compileElement(node) {
    console.log(node);
    const attrs = node.attributes; // 将属性拿到之后 
    Array.from(attrs).forEach(attr => { // 循环节点,判断是不是v-moedl指令
      if (this.isDricetive(attr.name)) { // 是自定义指令的话
        // 咱们就去拿到他所绑定的值 也就是data中定义的值
        let expr = attr.value; // name   age
        // attr.name // --> v-model  v-text v-html
        const [, type] = attr.name.split('-'); // [v, model]
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  //第五个方法
  compileText(node) {
    console.log(node);
  }
}

// 第七个函数集合
const CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.'); // [a,b,c]
    return expr.reduce((prev, next) => {
      console.log(prev, next);
      return prev[next] // 一直获取下一个 直到获取完成
    }, vm.$data); // 作为第一个参数
  },
  model(node, vm, expr) { // vm.$data
    console.log(expr);
    const update = this.updater['updaterModel'];
    
    
    /**              节点  数据- a.b.c */
    update && update(node, this.getVal(vm, expr)); // 更新视图
  },
  text() {
    
  },
  // 第八个函数
  updater: {
    updaterText() {

    },
    updaterModel(node, val) {
      node.value = val;
    },
  }
}
```

经过修改之后 插值表达式的数据也渲染了

```js
const reg = /\{\{([^}]+)\}\}/g;

class Compile {
  // vm --> 实例
  constructor(el, vm) {
    this.el = this.isNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    

    if (this.el) { // 是 最外层元素 但是咱们需要将内部元素进行塞进去
      // 写一个方法 将元素写进内存中
      // 文档碎片
      const fragment = this.nodeToFrogmen(this.el);
      // console.log(this.el);
      // 见名思意 编译  
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }

  
  // 第一个方法 判断是不是一个node节点
  isNode(node) {
    return node.nodeType === 1;
  }

  // 第六个方法
  isDricetive(name) {
    return name.includes('v-'); // es7 方法
  }

  // 第二个方法
  nodeToFrogmen(node) {
    // 如果 有元素的话 咱们讲节点放到内存中去处理 原因就是快
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  // 第三个方法
  compile(fragment) {
    let childNodes = fragment.childNodes; // 从内存中获取出node节点
    // console.log(childNodes); // 一个数组
    Array.from(childNodes).forEach(node => {
      if (this.isNode(node)) { // node 节点
        this.compileElement(node);
        this.compile(node); // 递归 获取深层节点
      } else { // 文本节点
        this.compileText(node);
      }
    }) 
  }

  // 第四个方法
  compileElement(node) {
    // console.log(node);
    const attrs = node.attributes; // 将属性拿到之后 
    Array.from(attrs).forEach(attr => { // 循环节点,判断是不是v-moedl指令
      if (this.isDricetive(attr.name)) { // 是自定义指令的话
        // 咱们就去拿到他所绑定的值 也就是data中定义的值
        let expr = attr.value; // name   age
        // attr.name // --> v-model  v-text v-html
        const [, type] = attr.name.split('-'); // [v, model]
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  //第五个方法
  compileText(node) {
    const expr = node.textContent;
    if (reg.test(expr)) {
      CompileUtil['text'](node, this.vm, expr);
    }
  }
}

// 第七个函数集合
const CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.'); // [a,b,c]
    return expr.reduce((prev, next) => {
      return prev[next] // 一直获取下一个 直到获取完成
    }, vm.$data); // 作为第一个参数
  },
  getTextVla(vm, expr) {
    return expr.replace(reg, (...arguments) => {
      return this.getVal(vm, arguments[1]);
    });
  },
  model(node, vm, expr) { // vm.$data
    const update = this.updater['updaterModel'];
    
    
    /**              节点  数据- a.b.c */
    update && update(node, this.getVal(vm, expr)); // 更新视图
  },
  text(node, vm, expr) {
    // console.log(node, vm, expr); // "{{form.b.c}}" 将 花括号去掉
    const update = this.updater['updaterText'];

    // expr.replace(reg, (...arguments) => {
    // })
    update && update(node, this.getTextVla(vm, expr));
  },
  // 第八个函数
  updater: {
    updaterText(node, val) {
      console.log(node, val);
      node.textContent = val;// 进行一个文本替换就可以了
    },
    updaterModel(node, val) {
      node.value = val;
    },
  }
}
```

渲染之后就是咱们的数据劫持 observe ,什么是数据劫持 也就是咱们常说的 object,defineProperty 将每一个`data`中的数据都绑定上

5. 创建observe文件 并修改 mvvm文件

```js
class Mvvm extends Object {
  constructor({el, data}) { // options
    super();
    this.$el = el;
    this.$data = data;

    if (this.$el) { // 如果用户传元素进来了 咱们讲页面上的东西先渲染出来
      // 也就是编译出咱们想要的结果
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}
```

这样的话 在data中的数据就有 get set方法了

```js
class Observer {
  constructor(data) {
    this.data = data; // 拿到的是data所有数据
    this.observer(this.data);
  }
  observer(data) { // 严禁一下 万一传过来的不是对象
    if (!data || typeof data !== 'object') {
      return;
    }
    // 要将数据进行劫持 就要获取到data中的key和value
    Object.keys(data).forEach(key => { // key -> a.b.c
      this.defineReactive(data, key, data[key]); // 惊醒数据劫持
      this.observer(data[key]);
    })
  }
  // get  set
  defineReactive(obj, key, val) {
    const that = this;
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举 循环能循环出来
      configurable: true, // 可删除
      get() {
        return val;
      },
      set(newVal) { // 看看相等不
        if (newVal !== val) { // val 上面获取出来的
          // 也有可能之前的代码是 {a: 1} 后为 {b:2}
          that.observer(newVal);
          val = newVal; 
        }
      }
    })
  }
}
```

现在呢 数据绑定了 视图渲染了 但是两者之间还没又直接的关系,所有咱们想让他们发生点关系,然后就有了 watcher

7. 创建 watcher .js

```js
class Watcher {
  constructor(vm, ex, cb) {
    this.vm = vm;
    this.ex = ex;
    this.cb = cb;
    
    this.value = this.get(vm, ex);
  }

  getVal(vm, ex) {
    ex = ex.split('.'); // [a,b,c]
    return ex.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  // 新值与旧值进行对比, 发生变化 就调用更新的方法
  get() {
    Dep.target = this;
    let val = this.getVal(this.vm, this.ex);
    Dep.target = null;
    return val;
  }
  // 对外暴露的方法
  update() {
    let newValue = this.getVal(this.vm, this.ex);
    let oldValue = this.value;
    if (oldValue !== newValue) {
      this.cb(newValue); // 调用 watch 的 callback
    }
  }
}

```

改造compile文件 

```js
const reg = /\{\{([^}]+)\}\}/g;

class Compile {
  // vm --> 实例
  constructor(el, vm) {
    this.el = this.isNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    

    if (this.el) { // 是 最外层元素 但是咱们需要将内部元素进行塞进去
      // 写一个方法 将元素写进内存中
      // 文档碎片
      const fragment = this.nodeToFrogmen(this.el);
      // console.log(this.el);
      // 见名思意 编译  
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }

  
  // 第一个方法 判断是不是一个node节点
  isNode(node) {
    return node.nodeType === 1;
  }

  // 第六个方法
  isDricetive(name) {
    return name.includes('v-'); // es7 方法
  }

  // 第二个方法
  nodeToFrogmen(node) {
    // 如果 有元素的话 咱们讲节点放到内存中去处理 原因就是快
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  // 第三个方法
  compile(fragment) {
    let childNodes = fragment.childNodes; // 从内存中获取出node节点
    // console.log(childNodes); // 一个数组
    Array.from(childNodes).forEach(node => {
      if (this.isNode(node)) { // node 节点
        this.compileElement(node);
        this.compile(node); // 递归 获取深层节点
      } else { // 文本节点
        this.compileText(node);
      }
    }) 
  }

  // 第四个方法
  compileElement(node) {
    // console.log(node);
    const attrs = node.attributes; // 将属性拿到之后 
    Array.from(attrs).forEach(attr => { // 循环节点,判断是不是v-moedl指令
      if (this.isDricetive(attr.name)) { // 是自定义指令的话
        // 咱们就去拿到他所绑定的值 也就是data中定义的值
        let expr = attr.value; // name   age
        // attr.name // --> v-model  v-text v-html
        const [, type] = attr.name.split('-'); // [v, model]
        CompileUtil[type](node, this.vm, expr);
      }
    })
  }
  //第五个方法
  compileText(node) {
    const expr = node.textContent;
    if (reg.test(expr)) {
      CompileUtil['text'](node, this.vm, expr);
    }
  }
}

// 第七个函数集合
const CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.'); // [a,b,c]
    return expr.reduce((prev, next) => {
      return prev[next] // 一直获取下一个 直到获取完成
    }, vm.$data); // 作为第一个参数
  },
  getTextVla(vm, expr) {
    return expr.replace(reg, (...arguments) => {
      return this.getVal(vm, arguments[1]);
    });
  },
  model(node, vm, expr) { // vm.$data
    const update = this.updater['updaterModel'];
    // 这里加监听的方法 
    new Watcher(vm, expr, (newVal) => {
      update && update(node, this.getVal(vm, expr)); // 更新视图
    });
    /**              节点  数据- a.b.c */
    update && update(node, this.getVal(vm, expr)); // 更新视图
  },
  text(node, vm, expr) {
    // console.log(node, vm, expr); // "{{form.b.c}}" 将 花括号去掉
    const update = this.updater['updaterText'];

    // {{startTime}}-{{endTime}}
    expr.replace(reg, (...arguments) => {
      // 一个节点添加两个观察者
      new Watcher(vm, arguments[1], (newVal) => {
        /**                    应该从数据中拿到最新的值 然后去渲染 */
        update && update(node, this.getTextVla(vm, expr)); // 更新视图
      });
    })
    update && update(node, this.getTextVla(vm, expr));
  },
  // 第八个函数
  updater: {
    updaterText(node, val) {
      node.textContent = val;// 进行一个文本替换就可以了
    },
    updaterModel(node, val) {
      node.value = val;
    },
  }
}
```

咱们绑定完watcher 发现 没有调用 watcher的`update `方法,所以 即使咱们的数据发生变化了 视图也不会发生变化 ,接下来咱们继续改造

observe.js

```js
class Observer {
  constructor(data) {
    this.data = data; // 拿到的是data所有数据
    this.observer(this.data);
  }
  observer(data) { // 严禁一下 万一传过来的不是对象
    if (!data || typeof data !== 'object') {
      return;
    }
    // 要将数据进行劫持 就要获取到data中的key和value
    Object.keys(data).forEach(key => { // key -> a.b.c
      this.defineReactive(data, key, data[key]); // 惊醒数据劫持
      this.observer(data[key]);
    })
  }
  // get  set
  defineReactive(obj, key, val) {
    const that = this;
    let dep = new Dep(); // -------------
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举 循环能循环出来
      configurable: true, // 可删除
      get() {
        Dep.target && dep.addSub(Dep.target); // 单线程的特点
        return val;
      },
      set(newVal) { // 看看相等不
        if (newVal !== val) { // val 上面获取出来的
          // 也有可能之前的代码是 {a: 1} 后为 {b:2}
          that.observer(newVal);
          val = newVal; 
          dep.notify(); // 更新方法
        }
      }
    })
  }
}

class Dep {
  constructor() {
    // 订阅的数组
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 一调跟新 文本进行复制 输入框进行复制 
  notify() {
    this.subs.forEach(watcher => {
      console.log(watcher);
      watcher.update()
    });
  }
}
```

MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。