/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 17:38:22
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 18:26:40
 * @FilePath: /MVVM/test3/observer.js
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
      this.defineDriective(data, key, data[key]);
      this.observer(data[key]);
    });
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
      set(newVal) { // 设置的时候需要和之前的对比 不然不跟
        val = newVal;
        that.observer(newVal);
        dep.untify();
      }
    })
  }
}