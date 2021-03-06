/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 22:56:10
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 23:20:41
 * @FilePath: /MVVM/test5/watcher.js
 */
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;

    // 一调watch 是 保存 旧值
    this.oldVal = this.get(vm, expr);
  }
  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data); 
  }
  get(vm, expr) {
    Dep.target = this;
    const val = this.getVal(vm, expr);
    return val;
  }

  updateFn() {
    const newVal = this.getVal(this.vm, this.expr);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  untify() {
    this.subs.forEach(watcher => {
      watcher.updateFn();
    })
  }
}