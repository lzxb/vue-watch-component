## vue-watch-component
[![Build Status](https://travis-ci.org/lzxb/vue-watch-component.svg)](https://travis-ci.org/lzxb/vue-watch-component)
[![npm](https://img.shields.io/npm/v/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component) 
[![npm](https://img.shields.io/npm/dm/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)
[![npm](https://img.shields.io/npm/dt/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)

## 介绍
只在组件激活时，观察数据变化

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
const watchItem = {
  deep: false, // 是否检测对象内部的值发生变化，默认false
  immediate: false, // 是否立即触发handler钩子回调，默认false
  watch () {
    // 观察数据变化，基于vm.$watch实现
    // this 会指向到注入的组件
    return this.globalState.count
  },
  handler (newVal, oldVal) {
    // this 会指向到注入的组件
    // 观察的数据发生变化，会调用此钩子
  }
}
// 添加观察
myWatch.add(watchItem)
// 解除观察
// myWatch.remove(watchItem)

// 2、全局状态，可以使用Vuet、vuex等第三方状态管理库
const globalState = {
  count: 0
}

// 3、在组件中使用，只有在组件激活时，才会进行观察
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

`原理`，Watch Component会在组件的`created`、`activated`钩子触发观察，在组件的`deactivated`、`beforeDestroy`解除监听，并且将结果保存起来，等组件激活时重新进行观察
