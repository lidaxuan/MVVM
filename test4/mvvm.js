/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 19:36:59
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 20:52:16
 * @FilePath: /MVVM/test4/mvvm.js
 */
class Mvvm {
  constructor({el, data}) { // options es6
    this.$el = el;
    this.$data = data;
    
    if (this.$el) {
      
      new Observer(this.$data);
      new Compile(this.$el, this);
    }
    console.log(this.$data);
  }
}