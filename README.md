## vue-watch-component
[![Build Status](https://travis-ci.org/lzxb/vue-watch-component.svg)](https://travis-ci.org/lzxb/vue-watch-component)
[![npm](https://img.shields.io/npm/v/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component) 
[![npm](https://img.shields.io/npm/dm/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)
[![npm](https://img.shields.io/npm/dt/vue-watch-component.svg)](https://www.npmjs.com/package/vue-watch-component)

## 介绍
在组件中使用全局状态，可以观测组件

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
  // ...
})

```

## Options