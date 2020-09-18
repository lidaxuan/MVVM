/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 14:58:01
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 15:29:44
 * @FilePath: /MVVM/test7/watcher.js
 */
// 订阅
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
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

  // 向外暴露的方法
  updata() {
    const newVal = this.getVal(this.vm, this.expr);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}
 // 发布订阅
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(Watcher) {
    this.subs.push(Watcher);
  } // 调取更新视图
  unitfy() {
    this.subs.forEach(watcher => {
      watcher.updata();
    })
  }
}