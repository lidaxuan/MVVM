/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 14:41:51
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 15:24:55
 * @FilePath: /MVVM/test2/MVVM.js
 */
class Mvvm extends Object {
  constructor({el, data}) { // options
    super();
    this.$el = el;
    this.$data = data;

    if (this.$el) { // 如果用户传元素进来了 咱们讲页面上的东西先渲染出来
      // 也就是编译出咱们想要的结果
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}