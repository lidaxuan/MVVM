/* jshint esversion: 6 */
/*
 * @Description:
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 10:10:38
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 11:20:45
 * @FilePath: /MVVM/test/compile.js
 */
class Compile extends Object {
  constructor(el, vm) {
    super();
    this.el = this.isElementNode(el) ? el : document.querySelector(el); // 判断
    this.vm = vm;

    if (this.el) { // 如果有元素
      // 1. 先把真实dom 放到fragment 内存中 要快
      let fragment = this.nodeToFragment(this.el);

      // 2. 编译 v-model 塞入节点中  和 {{}} -- 替换
      this.compile(fragment);

      // 3. 把编译之后的fragment 赛回到页面中
      this.el.appendChild(fragment);
    }
  }
  /**
   * 写一些辅助方法
   */
  
    isElementNode(node) {
      return node.nodeType === 1;
    }
    // 是不是指令
    isDriective(name) {
      return name.includes('v-');
    }

   /**
    * 核心方法
    */
    nodeToFragment(el) { // 需要将操作的东西 放到 fragment 
      let fragment = document.createDocumentFragment();
      let firstChild;
      // console.log(el); // #app
      while (firstChild = el.firstChild) {
        fragment.appendChild(firstChild); // 真实节点放到内存中
      }
      return fragment;
    }
    compile(fragment) {
      let childNodes = fragment.childNodes; // 数组
      Array.from(childNodes).forEach(node => {
        if (this.isElementNode(node)) {
          // console.log('element', node);
          this.compileElement(node);
          this.compile(node); // 元素节点深入检查
          // 元素节点
        } else {
          // console.log('text', node);
          // 文本节点
          this.compileText(node);
        }
      })
    }

    compileElement(node) {
      // v-model
      let attrs = node.attributes;
      // console.log(attrs);
      Array.from(attrs).forEach(attr => {
        // console.log(attr);
        // console.log(attr.value);
        // console.log(attr.name);
        if (this.isDriective(attr.name)) {
          let ex = attr.value;
          const [,type] = attr.name.split('-');
          CompileUtil[type](node, this.vm, ex)
        }
      })
    }

    compileText (node) {
      // {{}}
      let ex = node.textContent;
      let reg = /\{\{([^}]+)\}\}/g;
      if (reg.test(ex)) {
        console.log(CompileUtil['text']);
        CompileUtil['text'](node, this.vm, ex)
      }
    }
}

CompileUtil = {
  getVal(vm, ex) {
    ex = ex.split('.'); // [a,b,c]
    return ex.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, ex) {
    console.log(ex);
    return ex && ex.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      return this.getVal(vm, arguments[1]);
    });
  },
  text(node, vm, ex) {
    let update = this.updater['updaterText'];

    let value = this.getTextVal(vm, ex);
    ex.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      new Watcher(vm, arguments[1], newVlue => {
        update && update(node, this.getTextVal(vm, ex));
      });
    });
    
    update && update(node, value);
  },
  setVal(vm, ex, value){
    ex = ex.split('.');
    return ex.reduce((prev, next, currentIndex) => {
      if (currentIndex === ex.length-1) {
        return prev[next] = value;
      }
      return prev[next];
    }, vm.$data);
  },
  // v-model
  model(node, vm, ex) {
    let update = this.updater['updaterModel'];
    const watcher = new Watcher(vm, ex, newVlue => {
      update && update(node, this.getVal(vm, ex));
    });
    node.addEventListener('input',e => {
      let newValue = e.target.value;
      this.setVal(vm, ex, newValue);
    })
    update && update(node, this.getVal(vm, ex));
  },
  updater: {
    updaterText(node, value) {
      node.textContent = value;
    },
    updaterModel(node, value) {
      node.value = value;
    },
  },
}