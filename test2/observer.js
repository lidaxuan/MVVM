/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 14:42:22
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 15:56:36
 * @FilePath: /MVVM/test2/observer.js
 */
class Observer {
  constructor(data) {
    this.data = data;

    this.observe(data);
  }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]);
    });
  }
  defineReactive(obj, key, val) {
    const that = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) { 
        // 如果传进来的是一个新对象 递归调用observer
        that.observe(newVal);
        val = newVal;
        dep.updater();
      }
    })
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  updater() {
    this.subs.forEach(watcher => {
      watcher.update();
    })
  }
}