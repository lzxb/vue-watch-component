const ava = require('ava')
const Vue = require('vue')
const WatchComponent = require('../dist/vue-watch-component')

Vue.use(WatchComponent)

ava('clone', async t => {
  const watchOptions = {
    watch () {},
    handler () {}
  }
  const wc = new WatchComponent(watchOptions)
  t.is(wc.initialOptions, wc.clone().initialOptions)
})

ava('errors', async t => {
  const errors = []
  try {
    const watchOptions = {}
    return new WatchComponent(watchOptions)
  } catch (e) {
    errors.push(e.toString())
  }
  try {
    const watchOptions = {
      watch () {}
    }
    return new WatchComponent(watchOptions)
  } catch (e) {
    errors.push(e.toString())
  }
  t.deepEqual(errors, [
    'Error: [vue-watch-component] options.watch must be a function type',
    'Error: [vue-watch-component] options.handler must be a function type'
  ])
})

ava('base', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 0)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 1)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 1)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('immediate = true', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    immediate: true,
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 2)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 2)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('deep = false', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    immediate: true,
    deep: false,
    watch () {
      return this.globalState
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 1)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 1)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('immediate = true', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    immediate: true,
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 2)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 2)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('deep = true', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    immediate: true,
    deep: true,
    watch () {
      return this.globalState
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 2)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 2)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('value = 0', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    value: 0,
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 0)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 1)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 1)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('value = -1', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    value: -1,
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 2)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 2)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})

ava('value = -1 && immediate = true', async t => {
  const watchLog = {
    count: 0
  }
  const watchOptions = {
    value: 0,
    immediate: true,
    watch () {
      return this.globalState.count
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
      return { globalState }
    }
  })
  t.is(watchLog.count, 1)
  t.is(globalState.count, 0)
  t.is(vm.globalState.count, 0)
  t.is(wc.vmArr.length, 1)
  t.is(wc.unwatchArr.length, 1)

  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 1)
  t.is(vm.globalState.count, 1)
  t.is(watchLog.count, 2)

  vm.$destroy()
  globalState.count++
  await vm.$nextTick()
  t.is(globalState.count, 2)
  t.is(vm.globalState.count, 2)
  t.is(watchLog.count, 2)
  t.is(wc.vmArr.length, 0)
  t.is(wc.unwatchArr.length, 0)
})
