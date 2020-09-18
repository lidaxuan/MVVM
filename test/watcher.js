/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 16:39:19
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-16 17:41:15
 * @FilePath: /js-test/MVVM/watcher.js
 */
// 观察这的目的就是给需要变化的那个元素增加一个观察者, 当数据发生变化的时候执行相应的方法
class Watcher {
  constructor(vm, ex, cb) {
    this.vm = vm;
    this.ex = ex;
    this.cb = cb;
    
    this.value = this.get(vm, ex);
  }

  getVal(vm, ex) {
    ex = ex.split('.'); // [a,b,c]
    return ex.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  // 新值与旧值进行对比, 发生变化 就调用更新的方法
  get() {
    Dep.target = this;
    let val = this.getVal(this.vm, this.ex);
    Dep.target = null;
    return val;
  }
  // 对外暴露的方法
  update() {
    let newValue = this.getVal(this.vm, this.ex);
    let oldValue = this.value;
    if (oldValue !== newValue) {
      this.cb(newValue); // 调用 watch 的 callback
    }
  }
}
