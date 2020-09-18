/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 14:49:05
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 15:10:27
 * @FilePath: /MVVM/test7/observer.js
 */
class Observer {
  constructor(data) {
    this.data = data;
    this.observer(data);
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
  defineDriective(obj, key, val)  {
    let dep = new Dep();
    const that = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) { // {name: 1} {a:1}
        that.observer(newVal)
        val = newVal;
        dep.unitfy();
      }
    })
  }
}