/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 10:11:27
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 10:33:06
 * @FilePath: /MVVM/test6/observer.js
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
    const that = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) { // {name: 1} {a:1}
        that.observer(newVal);
        val = newVal;
        dep.unitfy();
      }
    })
  }
}