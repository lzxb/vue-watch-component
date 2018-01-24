const ava = require('ava')
const Vue = require('vue')
const WatchComponent = require('../dist/vue-watch-component')

function pause (time) {
  let ready = null
  setTimeout(() => {
    ready()
  }, time || 0)
  return new Promise(r => {
    ready = r
  })
}

Vue.use(WatchComponent)

ava.serial('add', t => {
  const wc = new WatchComponent()
  const watchItem = {
    watch () {
      return this.name
    },
    handler () {
    }
  }
  wc.add(watchItem)
  t.is(watchItem, wc.watches[0])
})

ava.serial('add', t => {
  const wc = new WatchComponent()
  const watchItem = {
    watch () {
      return this.name
    },
    handler () {
    }
  }
  wc.add(watchItem)
  wc.remove({})
  t.is(watchItem, wc.watches[0])
  wc.remove(watchItem)
  t.deepEqual([], wc.watches)
})

ava.serial('base', async t => {
  const wc = new WatchComponent()
  let count = 0
  const watchItem = {
    watch () {
      return this.name + this.age
    },
    handler () {
      count++
    }
  }
  wc.add(watchItem)

  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        name: 'ok',
        age: 18,
        money: 100
      }
    }
  })
  t.is(count, 0)

  vm.name = 'test'
  await pause(0)
  t.is(count, 1)

  vm.age = 28
  await pause(0)
  t.is(count, 2)

  vm.money = 1000
  await pause(0)
  t.is(count, 2)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await pause(0)
  t.is(count, 2)

  vm.age = 38
  await pause(0)
  t.is(count, 2)

  vm.money = 10000
  await pause(0)
  t.is(count, 2)
})

ava.serial('set value equal', async t => {
  const wc = new WatchComponent()
  const values = []
  let count = 0
  let value = 'ok18'
  const watchItem = {
    get value () {
      return value
    },
    set value (val) {
      values.push(val)
      value = val
    },
    watch () {
      return this.name + this.age
    },
    handler () {
      count++
    }
  }
  wc.add(watchItem)

  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        name: 'ok',
        age: 18,
        money: 100
      }
    }
  })
  t.is(count, 0)

  vm.name = 'test'
  await pause(0)
  t.is(count, 1)

  vm.age = 28
  await pause(0)
  t.is(count, 2)

  vm.money = 1000
  await pause(0)
  t.is(count, 2)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await pause(0)
  t.is(count, 2)

  vm.age = 38
  await pause(0)
  t.is(count, 2)

  vm.money = 10000
  await pause(0)
  t.is(count, 2)

  t.deepEqual(values, [
    'test18',
    'test28'
  ])
})

ava.serial('set value not equal', async t => {
  const wc = new WatchComponent()
  const values = []
  let count = 0
  let value
  const watchItem = {
    get value () {
      return value
    },
    set value (val) {
      values.push(val)
      value = val
    },
    watch () {
      return this.name + this.age
    },
    handler () {
      count++
    }
  }
  wc.add(watchItem)

  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        name: 'ok',
        age: 18,
        money: 100
      }
    }
  })
  t.is(count, 1)

  vm.name = 'test'
  await pause(0)
  t.is(count, 2)

  vm.age = 28
  await pause(0)
  t.is(count, 3)

  vm.money = 1000
  await pause(0)
  t.is(count, 3)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await pause(0)
  t.is(count, 3)

  vm.age = 38
  await pause(0)
  t.is(count, 3)

  vm.money = 10000
  await pause(0)
  t.is(count, 3)

  t.deepEqual(values, [
    'ok18',
    'test18',
    'test28'
  ])
})

ava.serial('set immediate true', async t => {
  const wc = new WatchComponent()
  let count = 0
  wc.add({
    immediate: true,
    watch () {
      return this.count
    },
    handler () {
      count++
    }
  })
  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        count: 100
      }
    }
  })
  t.is(count, 1)

  vm.count++
  await pause(0)
  t.is(count, 2)

  vm.$nextTick()
  vm.count++
  t.is(count, 2)
})

ava.serial('set immediate false', async t => {
  const wc = new WatchComponent()
  let count = 0
  wc.add({
    immediate: false,
    watch () {
      return this.count
    },
    handler () {
      count++
    }
  })
  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        count: 100
      }
    }
  })
  t.is(count, 0)

  vm.count++
  await pause(0)
  t.is(count, 1)

  vm.$nextTick()
  vm.count++
  t.is(count, 1)
})

ava.serial('set deep true', async t => {
  const wc = new WatchComponent()
  let count = 0
  wc.add({
    immediate: true,
    deep: true,
    watch () {
      return this.data
    },
    handler () {
      count++
    }
  })
  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        data: {
          count: 100
        }
      }
    }
  })
  t.is(count, 1)

  vm.data.count++
  await pause(0)
  t.is(count, 2)

  vm.$destroy()
  vm.data.count++
  t.is(count, 2)
})

ava.serial('set deep false', async t => {
  const wc = new WatchComponent()
  let count = 0
  wc.add({
    immediate: true,
    deep: false,
    watch () {
      return this.data
    },
    handler () {
      count++
    }
  })
  const vm = new Vue({
    watchComponents: [
      wc
    ],
    data () {
      return {
        data: {
          count: 100
        }
      }
    }
  })
  t.is(count, 1)

  vm.data.count++
  await pause(0)
  t.is(count, 1)

  vm.$destroy()
  vm.data.count++
  t.is(count, 1)
})
