/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 22:42:47
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 23:20:17
 * @FilePath: /MVVM/test5/observer.js
 */
class Observer {
  constructor(data) {
    this.data = data;
    this.observer(this.data);
  }
  observer(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      console.log(key);
      this.observer(data[key]);
      this.defineDriective(data,key, data[key]);
    })
  }
  defineDriective(obj, key, val) {
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
        that.observer();
        val = newVal;
        dep.untify();
      }
    })
  }
}