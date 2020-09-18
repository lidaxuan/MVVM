/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 21:00:57
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 21:56:39
 * @FilePath: /MVVM/test9/compile.js
 */
const reg = /\{\{([^}]+)\}\}/g; // {{  }}

class Compile {
  constructor(el, vm) {
    this.el = this.isElement(el) ? el : document.querySelector(el); // 
    this.vm = vm;
    if (this.el) {
      let fragment = this.nodeToFragment(this.el);
      this.compile(fragment);

      this.el.appendChild(fragment);
    }
  }
  
  isElement(node) {
    return node.nodeType === 1; // 4
  }
  isDriective(name) {
    return name.includes('v-');
  }

  nodeToFragment(node) {
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
      if (this.isElement(node)) {
        this.compile(node);
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
  getVal(vm, expr) {
    expr = expr.split('.'); // [a,b,c]
    return expr.reduce((prev, next, currentIndex) => {
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, expr) {
    return expr.replace(reg, (...auguments) => {
      return this.getVal(vm, auguments[1]);
    });
  },
  text(node, vm, expr) { // {{form.a.b.b}}
    expr.replace(reg, (...auguments) => {
      new Watcher(vm, auguments[1], newVal => {
        this.update.updaterText(node, this.getTextVal(vm, expr));
      })
    });
    this.update.updaterText(node, this.getTextVal(vm, expr));

  },
  setVal(vm, expr, newVal) {
    expr = expr.split('.'); // [a,b,c]
    return expr.reduce((prev, next, currentInde) => {
      if (currentInde === expr.length -1) {
        return prev[next] = newVal;
      }
      return prev[next];
    }, vm.$data);
  },
  model(node, vm, expr) {
    new Watcher(vm, expr, newVal => {
      this.update.updateElement(node, this.getVal(vm, expr));
    })
    node.addEventListener('input', e => {
      console.log(e.target.value);
      this.setVal(vm, expr, e.target.value);
    })
    this.update.updateElement(node, this.getVal(vm, expr));
  },
  update: {
    updateElement(node, val) {
      node.value = val;
    },
    updaterText(node, val) {
      node.textContent = val;
    }
  }
}