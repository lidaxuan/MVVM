/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 21:00:07
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 14:17:33
 * @FilePath: /MVVM/test1/compile.js
 */
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
  setVal(vm, expr, value) { // a.b.c
    expr = expr.split('.');
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length-1) {
        return prev[next] = value; 
      }
      return prev[next];
    }, vm.$data);
  },
  model(node, vm, expr) { // vm.$data
    const update = this.updater['updaterModel'];
    // 这里加监听的方法 
    new Watcher(vm, expr, (newVal) => {
      update && update(node, this.getVal(vm, expr)); // 更新视图
    });
    node.addEventListener('input', (e) => {
      console.log(e.target.value);
      this.setVal(vm, expr, e.target.value);
    })
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