const ava = require('ava')
const Vue = require('vue')
const WatchComponent = require('../dist/vue-watch-component')

// const helpers = {
//   pause (time) {
//     let ready = null
//     setTimeout(() => {
//       ready()
//     }, time || 0)
//     return new Promise(resolve => {
//       ready = resolve
//     })
//   }
// }

Vue.use(WatchComponent)

ava('base', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    watch () {
      return this.count
    },
    handler () {
      watchLog.count++
    }
  }
  const wc = new WatchComponent(watchOptions)
  const globalState = {
    count: 0
  }
  const vm = new Vue({
    watchComponents: [wc],
    data () {
      return globalState
    }
  })
  t.is(watchLog.count, 0)
  t.is(globalState.count, 0)
  t.is(vm.count, 0)
  t.is(typeof wc.unwatch, 'function')
  t.is(wc.vm, vm)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.count, 1)
  t.is(watchLog.count, 1)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.count, 2)
  t.is(watchLog.count, 1)
  t.is(wc.unwatch, null)
  t.is(wc.vm, null)
})
