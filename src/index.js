const util = {
  isArray (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  },
  has (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
}

class VueWatchComponent {
  constructor (options) {
    this.options = { ...options }
    this.vm = null
    this.unwatch = null
  }
  init (vm) {
    if (this.vm) {
      throw new Error('[vue-watch-component] An instance can only be used on one component')
    }
    const options = this.options
    const watchOptions = {
      immediate: true
    }
    if (util.has(options, 'deep')) {
      watchOptions.deep = options.deep
    }
    let isBtn = true
    const unwatch = vm.$watch(() => {
      return options.watch.call(vm)
    }, (newVal, oldVal) => {
      if (isBtn && options.immediate !== true) {
        isBtn = false
        if (options.value === newVal) {
          return
        }
      }
      if (typeof options.handler === 'function' && (util.has(options, 'value') || options.immediate === true)) {
        options.handler.call(vm, newVal, oldVal)
      }
      options.value = newVal
    }, watchOptions)
    this.vm = vm
    this.unwatch = unwatch
  }
  destroy () {
    this.vm = null
    this.unwatch()
    this.unwatch = null
  }
}

const toBe = (vm, callback) => {
  const { watchComponents } = vm.$options
  if (!util.isArray(watchComponents)) return
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
