/* jshint esversion: 6 */
/*
 * @Description: 

 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 20:56:41
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 21:38:35
 * @FilePath: /MVVM/test9/mvvm.js
 */
class Mvvm {
  constructor({el, data}) { // options
    this.$el = el; // opt.el
    this.$data = data;

    if (this.$el) {

      new Observer(this.$data);

      new Compile(this.$el, this); // 编译
    }
    console.log(this.$data);
  }
}