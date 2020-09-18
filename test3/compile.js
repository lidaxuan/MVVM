/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 16:40:19
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 18:37:17
 * @FilePath: /MVVM/test3/compile.js
 */

const reg = /\{\{([^}]+)\}\}/g;
class Compile{
  constructor(el, vm){
    this.el = this.isElement(el) ? el : document.querySelector(el);
    this.vm = vm;
    if (this.el) {
      const fragment = this.nodeTofragment(this.el);
      
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

  nodeTofragment(node) {
    const fragment =  document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        this.compileElement(node);
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
  getVal (vm, expr) {
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
  setVal( vm, expr, val) {
    console.log(vm, expr, val);
    expr = expr.split('.');
    return expr.reduce((prev, next, index) => {
      if (index === expr.length - 1) {
        return prev[next] = val;
      }
      return prev[next];
    }, vm.$data)
  },
  text(node, vm, expr) {
    expr.replace(reg, (...arguments) => {
      new Watcher(vm, arguments[1], newVal => {
        this.update.updateText(node, this.getTextVal(vm, expr));
      }) 
    })
    this.update.updateText(node, this.getTextVal(vm, expr));
  },
  model(node, vm, expr) {
    new Watcher(vm, expr, newVal => {
      this.update.updateModel(node, this.getVal(vm, expr));
    });
    node.addEventListener('input', e => {
      this.setVal( vm, expr, e.target.value);
    })
    this.update.updateModel(node, this.getVal(vm, expr));
  },
  update: {
    updateText(node, val) {
      node.textContent = val;
    },
    updateModel(node, val) {
      node.value = val;
    }
  }
}