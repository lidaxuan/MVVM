/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 19:39:32
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 21:21:19
 * @FilePath: /MVVM/test4/compile.js
 */

const reg = /\{\{([^}]+)\}\}/g;
class Compile {
  constructor(el, vm) {
    this.el = this.iElement(el) ? el : document.querySelector(el);
    this.vm = vm;

    if (this.el) {
      let fragment = this.nodetToFragment(this.el);
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }

  iElement(node) {
    return node.nodeType === 1;
  }
  isDriective(name) {
    return name.includes('v-');
  }

  nodetToFragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.iElement(node)) {
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
      if (this.isDriective(attr.name)) {
        const [, type] = attr.name.split('-');
        CompileUtil[type](node, this.vm, attr.value);
      }
    })
  }
  compileText(node) {
    if (reg.test(node.textContent)) {
      // console.log(node);
      CompileUtil['text'](node, this.vm, node.textContent);
    }
  }
}

const CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, expr) {
    return expr.replace(reg, (...arguments) => {
      // console.log(arguments);
      return this.getVal(vm, arguments[1]);
    })
  },
  text(node, vm, expr) {
    expr.replace(reg, (...arguments) => {
      new Watcher(vm, arguments[1], newVal => {
        this.update.updateText(node, this.getTextVal(vm, expr));
      })
    })
    this.update.updateText(node, this.getTextVal(vm, expr));
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
  model(node, vm, expr) {
    // console.log(node, vm, expr);
    new Watcher(vm, expr, newVal => {
      console.log(this.getVal(vm, expr));
      this.update.updateElement(node, this.getVal(vm, expr));
    })
    node.addEventListener('input' , e => {
      console.log(e);
      this.setVal(vm, expr, e.target.value);
    })
    this.update.updateElement(node, this.getVal(vm, expr));
  },
  update: {
    updateElement(node, val) {
      node.value = val;
    },
    updateText( node, val) {
      node.textContent = val;
    }
  }
}