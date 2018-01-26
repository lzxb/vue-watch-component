var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var util = {
  isArray: function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  },
  has: function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
};

var VueWatchComponent = function () {
  function VueWatchComponent(options) {
    classCallCheck(this, VueWatchComponent);

    this.options = _extends({}, options);
    this.vm = null;
    this.unwatch = null;
  }

  createClass(VueWatchComponent, [{
    key: 'init',
    value: function init(vm) {
      if (this.vm) {
        throw new Error('[vue-watch-component] An instance can only be used on one component');
      }
      var options = this.options;
      var watchOptions = {
        immediate: true
      };
      if (util.has(options, 'deep')) {
        watchOptions.deep = options.deep;
      }
      var isBtn = true;
      var unwatch = vm.$watch(function () {
        return options.watch.call(vm);
      }, function (newVal, oldVal) {
        if (isBtn && options.immediate !== true) {
          isBtn = false;
          if (options.value === newVal) {
            return;
          }
        }
        if (typeof options.handler === 'function' && (util.has(options, 'value') || options.immediate === true)) {
          options.handler.call(vm, newVal, oldVal);
        }
        options.value = newVal;
      }, watchOptions);
      this.vm = vm;
      this.unwatch = unwatch;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.vm = null;
      this.unwatch();
      this.unwatch = null;
    }
  }]);
  return VueWatchComponent;
}();

var toBe = function toBe(vm, callback) {
  var watchComponents = vm.$options.watchComponents;

  if (!util.isArray(watchComponents)) return;
  watchComponents.forEach(function (watchComponent) {
    callback(watchComponent);
  });
};

VueWatchComponent.install = function (Vue) {
  Vue.mixin({
    created: function created() {
      var _this = this;

      toBe(this, function (watchComponent) {
        return watchComponent.init(_this);
      });
    },
    activated: function activated() {
      var _this2 = this;

      toBe(this, function (watchComponent) {
        return watchComponent.init(_this2);
      });
    },
    deactivated: function deactivated() {
      var _this3 = this;

      toBe(this, function (watchComponent) {
        return watchComponent.destroy(_this3);
      });
    },
    beforeDestroy: function beforeDestroy() {
      var _this4 = this;

      toBe(this, function (watchComponent) {
        return watchComponent.destroy(_this4);
      });
    }
  });
};

VueWatchComponent.version = '0.0.1';

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.Vue) {
  window.Vue.use(VueWatchComponent);
}

export default VueWatchComponent;
//# sourceMappingURL=vue-watch-component.esm.js.map
