/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 17:21:58
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 18:17:05
 * @FilePath: /MVVM/test8/mvvm.js
 */
class Mvvm {
  constructor({el, data, computed}) {
    this.$el = el;
    this.$data = data;

    if (this.$el) {
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}