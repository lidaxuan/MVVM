/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 10:56:09
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 15:55:02
 * @FilePath: /MVVM/test2/watcher.js
 */
// 观察者的目的就是给需要变换的元素增加一个观察者模式, 当数据发生变化的商户执行相应的方法

class Watcher extends GetVal{
  constructor(vm, expr, cb) {
    super();
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.value = this.get(this.vm, this.expr);
  }
  get(vm, expr) {
    Dep.target = this; // 也就是将watcher 类传过去
    const val = super.getVal(vm, expr);
    return val;
  }
  // 向外暴露一个更新的方法 vue 就是这么做的
  update() {
    const newVal = super.getVal(this.vm, this.expr);
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