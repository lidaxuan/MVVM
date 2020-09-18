/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 17:47:06
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 18:28:21
 * @FilePath: /MVVM/test3/watcher.js
 */
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.value = this.get(this.vm, this.expr);
  }
  getVal (vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  get(vm, expr) {
    Dep.target = this;
    const val = this.getVal(vm, expr);
    Dep.target = null;
    return val
  }
  // 向外暴露的方法
  updateFn() {
    const newVal = this.getVal(this.vm, this.expr);
    if (this.value !== newVal) {
      this.cb(newVal);
    }
  }
}

class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  untify() {
    this.subs.forEach(watcher => {
      console.log(watcher);
      watcher.updateFn()
    });
  }
}