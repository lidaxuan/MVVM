/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 10:15:46
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 14:37:50
 * @FilePath: /MVVM/test1/observer.js
 */
class Observer {
  constructor(data) {
    this.data = data; // 拿到的是data所有数据
    this.observer(this.data);
  }
  observer(data) { // 严禁一下 万一传过来的不是对象
    if (!data || typeof data !== 'object') {
      return;
    }
    // 要将数据进行劫持 就要获取到data中的key和value
    Object.keys(data).forEach(key => { // key -> a.b.c
      this.defineReactive(data, key, data[key]); // 惊醒数据劫持
      this.observer(data[key]);
    })
  }
  // get  set
  defineReactive(obj, key, val) {
    const that = this;
    let dep = new Dep(); // -------------
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举 循环能循环出来
      configurable: true, // 可删除
      get() {
        Dep.target && dep.addSub(Dep.target); // 单线程的特点
        return val;
      },
      set(newVal) { // 看看相等不
        if (newVal !== val) { // val 上面获取出来的
          // 也有可能之前的代码是 {a: 1} 后为 {b:2}
          that.observer(newVal);
          val = newVal; 
          dep.notify(); // 更新方法
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
  // 一调跟新 文本进行复制 输入框进行复制 
  notify() {
    this.subs.forEach(watcher => {
      console.log(watcher);
      watcher.update()
    });
  }
}