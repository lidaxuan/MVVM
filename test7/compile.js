/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 14:11:33
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 15:14:35
 * @FilePath: /MVVM/test7/compile.js
 */

const reg = /\{\{([^}]+)\}\}/g;

class Compile {
  constructor(el, vm) {
    this.el = this.isElement(el) ? el : document.querySelector(el);
    this.vm = vm;

    if (this.el) {
      const fragment = this.nodeToFragment(this.el);
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }

  isElement(node) {
    return node.nodeType === 1;
  }
  isDriective(name) {
    return name.includes('v-');
  }

  nodeToFragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    };
    return fragment;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        this.compileElement(node);
        this.compile(node);
      } else {
        this.compileText(node);
      }
    })
  }
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      if (this.isDriective(attr.name)) {
        const [, type] = attr.name.split('-');
        CompileUtil[type](node, this.vm, attr.value);
      }
    })
  }
  compileText(node) {
    if (reg.test(node.textContent)) {
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
      return this.getVal(vm, arguments[1]);
    })
  },
  text(node, vm, expr) {
    expr.replace(reg, (...arguments) => {
      new Watcher(vm, arguments[1], () => {
        this.updata.updateText(node, this.getTextVal(vm, expr));
      })
    })
    this.updata.updateText(node, this.getTextVal(vm, expr));
  },
  setVal(vm, expr, newVal) {
    expr = expr.split('.');
    return expr.reduce((prev, next, i) => {
      if (i === expr.length - 1) {
        return prev[next] = newVal;
      }
      return prev[next];
    }, vm.$data);
  },
  model(node, vm, expr) {
    new Watcher(vm, expr, () => {
      this.updata.updateElement(node, this.getVal(vm, expr));
    })
    node.addEventListener('input', e => {
      this.setVal(vm, expr, e.target.value);
    }) 
    this.updata.updateElement(node, this.getVal(vm, expr));
  },
  updata: {
    updateElement(node, val) {
      node.value = val;
    },
    updateText(node, val) {
      node.textContent = val;
    }
  }
}