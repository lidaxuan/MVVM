/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 21:39:25
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 21:49:08
 * @FilePath: /MVVM/test9/watcher.js
 */
class Watcher {
  constructor (vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    
    this.oldVal = this.get(vm, expr);
  }
  get(vm, expr) {
    Dep.target = this;
    let val = CompileUtil.getVal(vm, expr);
    Dep.target = null;
    return val;
  }

  // 
  updata() {
    const newVal = CompileUtil.getVal(this.vm, this.expr);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub (watcher) {
    this.subs.push(watcher);
  }

  unitfy() {
    this.subs.forEach(watcher => {
      watcher.updata();
    })
  }
}

