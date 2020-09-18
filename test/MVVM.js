/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-16 10:09:44
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-16 16:22:53
 * @FilePath: /js-test/MVVM/MVVM.js
 */
class MVVM extends Object {
  constructor({el, data}) { // opt
    super();
    // 数据保存 保证类上面的方法都能使用
    console.log(el);
    this.$el = el; // opt.el
    this.$data = data;
    
    if (this.$el) {
      // 数据劫持 
      new Observe(this.$data);
      // 用数据和元素进行编译
      new Compile(this.$el, this); // 属性特别多
    }
    console.log(this.$data);
  }
}