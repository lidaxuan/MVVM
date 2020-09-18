/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 22:04:49
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 22:55:34
 * @FilePath: /MVVM/test5/mvvm.js
 */
class Mvvm {
  constructor({el, data}) {
    this.$el = el;
    this.$data = data;

    if (this.$el) {
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}