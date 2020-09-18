/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 18:17:48
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 18:31:04
 * @FilePath: /MVVM/test8/watcher.js
 */
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.oldVal = this.get(vm, expr);
  }
  get(vm, expr) {
    Dep.target = this;
    const val = CompileUtil.getVal(vm, expr);
    return val;
  }

  update() {
    const newVal = CompileUtil.getVal(this.vm, this.expr);
    if (newVal !== this.oldVal) {
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
  unfity() {
    this.subs.forEach(watcher => {
      watcher.update();
    })
  }
}