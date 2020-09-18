/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 10:56:09
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 14:14:22
 * @FilePath: /MVVM/test1/watcher.js
 */
// 观察者的目的就是给需要变换的元素增加一个观察者模式, 当数据发生变化的商户执行相应的方法

class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;

    // 新值与旧值比较
    // 一调用watcher 就会调用 get方法
    this.value = this.get(this.vm, this.expr);
  }

  getVal(vm, ex) {
    ex = ex.split('.'); // [a,b,c]
    return ex.reduce((prev, next) => {
      return prev[next]; // 从data中获取值 也就是走 Object.defineProperty.get 方法
    }, vm.$data);
  }

  get() {
    Dep.target = this; // 用的时候 存入数组
    const val = this.getVal(this.vm, this.expr); // 使用完之后 
    Dep.target = null; // 销毁
    return val;
  }
  // 向外暴露的方法 一旦数据发生变化 就去执行 callback
  update() {
    let newVal = this.getVal(this.vm, this.expr);
    if (this.value !== newVal) {
      this.cb(newVal);
    }
  }
}

/* {
  watch() {
    
  }
}
vm.watch(vm, 'aaa', function (params) {
  
}) */