/* jshint esversion: 6 */
/*
 * @Description: 
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-17 15:38:12
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-17 15:40:11
 * @FilePath: /MVVM/test2/getVal.js
 */
class GetVal {
  constructor(vm, expr) {
    this.vm = vm;
    this.expr = expr;
  }
  getVal() {
    const expr = this.expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, this.vm.$data);
  }
}