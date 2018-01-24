## vue-watch-component
[![Build Status](https://travis-ci.org/lzxb/vue-watch-component.svg)](https://travis-ci.org/lzxb/vue-watch-component)
[![npm](https://img.shields.io/npm/v/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component) 
[![npm](https://img.shields.io/npm/dm/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)
[![npm](https://img.shields.io/npm/dt/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)

## 介绍
在组件中使用全局状态，可以观测组件

## 使用
``` bash
npm install --save vue-watch-component
```
```js
import Vue from 'vue'
import WatchComponent from 'vue-watch-component'

Vue.use(WatchComponent)

const myWatch = new WatchComponent()

myWatch.add({
  deep: false, // 是否检测对象内部的值发生变化，默认false
  immediate: false, // 是否立即触发handler钩子回调，默认false
  watch () {
    // 观测数据变化，基于vm.$watch实现
    // this 会指向到注入的组件
    return this.count
  },
  handler (newVal, oldVal) {
    // this 会指向到注入的组件
    // 观测的数据发生变化，会调用此钩子
  }
})

```

## Options
