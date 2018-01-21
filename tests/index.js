const ava = require('ava')
const Vue = require('vue')
const WatchComponent = require('../dist/vue-watch-component')

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
  await vm.$nextTick()
  t.is(count, 1)

  vm.age = 28
  await vm.$nextTick()
  t.is(count, 2)

  vm.money = 1000
  await vm.$nextTick()
  t.is(count, 2)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await vm.$nextTick()
  t.is(count, 2)

  vm.age = 38
  await vm.$nextTick()
  t.is(count, 2)

  vm.money = 10000
  await vm.$nextTick()
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
  await vm.$nextTick()
  t.is(count, 1)

  vm.age = 28
  await vm.$nextTick()
  t.is(count, 2)

  vm.money = 1000
  await vm.$nextTick()
  t.is(count, 2)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await vm.$nextTick()
  t.is(count, 2)

  vm.age = 38
  await vm.$nextTick()
  t.is(count, 2)

  vm.money = 10000
  await vm.$nextTick()
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
  await vm.$nextTick()
  t.is(count, 2)

  vm.age = 28
  await vm.$nextTick()
  t.is(count, 3)

  vm.money = 1000
  await vm.$nextTick()
  t.is(count, 3)

  t.is(wc.components[0], vm)
  t.is(wc.components.length, 1)

  vm.$destroy()
  t.is(wc.components.length, 0)

  vm.name = 'test2'
  await vm.$nextTick()
  t.is(count, 3)

  vm.age = 38
  await vm.$nextTick()
  t.is(count, 3)

  vm.money = 10000
  await vm.$nextTick()
  t.is(count, 3)

  t.deepEqual(values, [
    'ok18',
    'test18',
    'test28'
  ])
})
