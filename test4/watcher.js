/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 20:53:06
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 21:15:25
 * @FilePath: /MVVM/test4/watcher.js
 */
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.value = this.get(vm, expr);
  }

  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next]; // a.b.c
    }, vm.$data);
  }
  get(vm, expr) { // a.b.c
    Dep.target = this;
    let val = this.getVal(vm, expr);
    return val;
  }

  // 暴露给外面使用函数 更新
  updateFn() {
    const newVal = this.getVal(this.vm, this.expr);
    if (newVal !== this.value) {
      this.cb(newVal)
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

  unfity() {
    this.subs.forEach(watcher => {
      watcher.updateFn()
    });
  }
}
/* 
{
  Watcher() {

  }
} */