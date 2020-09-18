/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 10:23:49
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 10:31:05
 * @FilePath: /MVVM/test6/watcher.js
 */
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.val = this.get(vm, expr);
  }

  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  get(vm, expr){
    Dep.target = this;
    const val = this.getVal(vm, expr);
    console.log(val);
    return val
  }
  
  // 一个给外面使用的方法, 
  update() {
    const newVal = this.getVal(this.vm, this.expr);
    if (newVal !== this.val) {
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
  unitfy() {
    this.subs.forEach(watcher => {
      watcher.update();
    })
  }
}