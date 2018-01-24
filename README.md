## vue-watch-component
[![Build Status](https://travis-ci.org/lzxb/vue-watch-component.svg)](https://travis-ci.org/lzxb/vue-watch-component)
[![npm](https://img.shields.io/npm/v/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component) 
[![npm](https://img.shields.io/npm/dm/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)
[![npm](https://img.shields.io/npm/dt/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)

## 介绍
永久性观测组件中使用的全局状态发生是否变更

## 使用
``` bash
npm install --save vue-watch-component
```

```js
import Vue from 'vue'
import WatchComponent from 'vue-watch-component'

Vue.use(WatchComponent)

// 1、创建一个Watch Component 实例
const myWatch = new WatchComponent()

myWatch.add({
  deep: false, // 是否检测对象内部的值发生变化，默认false
  immediate: false, // 是否立即触发handler钩子回调，默认false
  watch () {
    // 观测数据变化，基于vm.$watch实现
    // this 会指向到注入的组件
    return this.globalState.count
  },
  handler (newVal, oldVal) {
    // this 会指向到注入的组件
    // 观测的数据发生变化，会调用此钩子
  }
})

// 2、全局状态，可以使用Vuet、vuex等第三方状态管理库
const globalState = {
  count: 0
}

// 3、在组件中使用
const MyComponent = {
  watchComponents: [
    myWatch
  ],
  data () {
    return {
      globalState
    }
  },
  // ... options
}

```

`注意`，Watch Component会在组件的`created`、`activated`钩子触发观测，在组件的`deactivated`、`beforeDestroy`解除监听，并且将结果保存起来，等待下次钩子触发观测时比较是否变更
