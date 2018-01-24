function isArray (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
function has (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
class VueWatchComponent {
  constructor () {
    this.watches = []
    this.components = []
    this.componentsSubs = []
  }
  add (watch) {
    this.watches.push(watch)
    return this
  }
  remove (watch) {
    const index = this.watches.indexOf(watch)
    if (index > -1) {
      this.watches.splice(index, 1)
    }
    return this
  }
  init (vm) {
    const componentsSubs = this.watches.map(watchOption => {
      const options = {
        immediate: true
      }
      if (has(watchOption, 'deep')) {
        options.deep = watchOption.deep
      }
      let isBtn = true
      return vm.$watch(() => {
        return watchOption.watch.call(vm)
      }, (newVal, oldVal) => {
        if (isBtn && watchOption.immediate !== true) {
          isBtn = false
          if (watchOption.value == newVal) {
            return
          }
        }
        if (typeof watchOption.handler === 'function' && (has(watchOption, 'value') || watchOption.immediate === true)) {
          watchOption.handler.call(vm, newVal, oldVal)
        }
        watchOption.value = newVal
      }, options)
    })
    this.components.push(vm)
    this.componentsSubs.push(componentsSubs)
  }
  destroy (vm) {
    const index = this.components.indexOf(vm)
    if (index === -1) return
    this.components.splice(index, 1)
    const componentsSubs = this.componentsSubs.splice(index, 1)
    componentsSubs.forEach(componentsSub => {
      componentsSub.forEach(unwatch => unwatch())
    })
  }
}

const toBe = (vm, callback) => {
  const { watchComponents } = vm.$options
  if (!isArray(watchComponents)) return
  watchComponents.forEach(watchComponent => {
    callback(watchComponent)
  })
}

VueWatchComponent.install = function (Vue) {
  Vue.mixin({
    created () {
      toBe(this, watchComponent => watchComponent.init(this))
    },
    activated () {
      toBe(this, watchComponent => watchComponent.init(this))
    },
    deactivated () {
      toBe(this, watchComponent => watchComponent.destroy(this))
    },
    beforeDestroy () {
      toBe(this, watchComponent => watchComponent.destroy(this))
    }
  })
}

VueWatchComponent.version = '__version__'

if (typeof window === 'object' && window.Vue) {
  window.Vue.use(VueWatchComponent)
}
export default VueWatchComponent
