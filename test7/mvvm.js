/* jshint esversion: 6 */
/*
 * @Description:  
 * @version: 
 * @Author: 李继玄（lijixuan@quclouds.com）
 * @Date: 2020-09-18 14:09:37
 * @LastEditors: 李继玄（lijixuan@quclouds.com）
 * @LastEditTime: 2020-09-18 17:04:17
 * @FilePath: /MVVM/test7/mvvm.js
 */
class Mvvm {
  constructor({el, data, computed}) {
    this.$el = el;
    this.$data = data;
    this.computed = computed;
    console.log(this.computed);
    if (this.$el) {
      new Observer(this.$data);


      for (const key in this.computed) {
        const that = this;
        Object.defineProperty(this.$data, key, {
          get() {
            return that.computed[key].call(this);
          }
        })
      }
      this.proxyVm(this.$data);

      new Compile(this.$el, this)
    }
    console.log(this.$data);
  }
  proxyVm(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        enumerable: true,
        get() {
          return data[key];
        }
      })
    }
  }

}