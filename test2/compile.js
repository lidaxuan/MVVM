/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 21:00:07
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 16:06:16
 * @FilePath: /MVVM/test2/compile.js
 */

const reg = /\{\{([^}]+)\}\}/g;
class Compile {
  constructor(el, vm){
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    if (this.el) {
      const fragment = this.nodeTofragment(this.el); // 拿到文档碎片之后 去编译 

      this.compile(fragment); // 渲染视图

      this.el.appendChild(fragment); // 释放内存
    }
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }
  isNode(node) {
    return node.nodo
  }
  isDricetive(name){
    return name.includes('v-');
  }

  nodeTofragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => { // 有node节点 有文本节点 
      if (this.isElementNode(node)) {
        this.compileElement(node);
        this.compile(node);
      } else {
        this.compileText(node);
      }
    })
  }
  compileElement(node) {
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      // console.log(attr);
      // 如果是自定义指令的话
      if (this.isDricetive(attr.name)) {
        const expr = attr.value;
        const [, type] = attr.name.split('-');
        // console.log(CompileUtil[type]);
        CompileUtil[type](node, this.vm, expr);
      }
    });
  }
  compileText(node) {
    // 判断文本是不是差值表达式
    if (reg.test(node.textContent)) {
      CompileUtil['text'](node, this.vm, node.textContent);
    }
  }
}
const CompileUtil = {
  // getVal(vm, expr) {
  //   expr = expr.split('.');
  //   return expr.reduce((prev, next) => {
  //     return prev[next];
  //   }, vm.$data);
  // },
  getTextVal(vm, expr) {
    return expr.replace(reg, (...arguments) => {
      const getVal = new GetVal(vm, arguments[1]);
      return getVal.getVal();
    })
  },
  setVal(vm, expr, newVal) {
    expr = expr.split('.');
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length -1) {
        return prev[next] = newVal;
      }
      return prev[next];
    }, vm.$data);
  },
  text(node, vm, expr) {
    const val = this.getTextVal(vm, expr);
    const update = this.updater['updaterText'];
    console.log(expr);
    // 没有处理的expr => {{a.b.c}}
    expr.replace(reg, (...arguments) => {
      new Watcher(vm, arguments[1], newVal => {
        update && update(node, this.getTextVal(vm, expr));
      });
    })
    update && update(node, val);
  },
  model(node, vm, expr) {
  // console.log(node, vm, expr); // 去拿数据
    const update = this.updater['updaterModel'];
    const getVal = new GetVal(vm, expr);
    new Watcher(vm, expr, newVal => {
      update && update(node, getVal.getVal());
    })
    node.addEventListener('input', e => {
      this.setVal(vm, expr, e.target.value);
    })
    update && update(node, getVal.getVal());
  },
  updater: {
    updaterText(node, val) {
      node.textContent = val;
    },
    updaterModel(node, val) {
      node.value = val;
    }
  }
}