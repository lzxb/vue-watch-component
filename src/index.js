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
    if (typeof options.watch !== 'function') {
      throw new Error('[vue-watch-component] options.watch must be a function type')
    }
    if (typeof options.handler !== 'function') {
      throw new Error('[vue-watch-component] options.handler must be a function type')
    }
    this.initialOptions = options
    this.options = { ...options }
    this.vmArr = []
    this.unwatchArr = []
  }
  clone () {
    return new VueWatchComponent(this.initialOptions)
  }
  init (vm) {
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
      if ((util.has(options, 'value') || options.immediate === true)) {
        options.handler.call(vm, newVal, oldVal)
      }
      options.value = newVal
    }, watchOptions)
    this.vmArr.push(vm)
    this.unwatchArr.push(unwatch)
  }
  destroy (vm) {
    const index = this.vmArr.indexOf(vm)
    this.vmArr.splice(index, 1)
    this.unwatchArr[index]()
    this.unwatchArr.splice(index, 1)
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
