/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 09:40:59
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 10:21:57
 * @FilePath: /MVVM/test6/mvvm.js
 */
class Mvvm {
  constructor ({el, data}) {
    this.$el = el;
    this.$data = data;
    if (this.$el) {
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}