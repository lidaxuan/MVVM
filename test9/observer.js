/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 21:33:10
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 21:50:34
 * @FilePath: /MVVM/test9/observer.js
 */
class Observer {
  constructor (data) {
    this.data = data;
    this.observer(this.data);
  }
  observer(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      this.observer(data[key]);
      this.defineDriective(data, key, data[key]);
    })
  }
  defineDriective(obj, key, val) {
    let dep = new Dep();
    const that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target); // watcher
        return val;
      },
      set(newVal) { // {name: 1}    {a : 1}
        that.observer(newVal);
        val = newVal;
        dep.unitfy();
      }
    })
  }
}