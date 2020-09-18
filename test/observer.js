/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 15:35:36
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-16 17:40:53
 * @FilePath: /js-test/MVVM/observer.js
 */
class Observe {
  constructor(data) {
    this.$data = data || {};
    this.observe(data);
  }
  observe(data) {
    // 将原有属性改为 get set
    if (!data || typeof data !== 'object') {
      return;
    }
    console.log(data);
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]);
    })
  }

  // 定义数据劫持
  defineReactive(obj, key, val){
    const that = this;
    let dep = new Dep();
    Object.defineProperty(obj, key,{
      enumerable: true,// 可枚举 enum 
      configurable: true, // 可删除
      get() { // 当取值是调用方法
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) { // 当给data属性中国设置值的时候, 更改获取的属性值
        console.log(newValue);
        if (newValue !== val) {
          that.observe(newValue);
          val = newValue;
          dep.notify(); // 通知所有人数据更新
        }
      }
    })
  }
}

class Dep {
  constructor() {
    // 订阅的数组
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => {
      console.log(watcher);
      watcher.update()
    });
  }
}