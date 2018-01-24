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

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

var VueWatchComponent = function () {
  function VueWatchComponent() {
    classCallCheck(this, VueWatchComponent);

    this.watches = [];
    this.components = [];
    this.componentsSubs = [];
  }

  createClass(VueWatchComponent, [{
    key: 'add',
    value: function add(watch) {
      this.watches.push(watch);
      return this;
    }
  }, {
    key: 'init',
    value: function init(vm) {
      var componentsSubs = this.watches.map(function (watchOption) {
        var options = {
          immediate: true
        };
        if (has(watchOption, 'deep')) {
          options.deep = watchOption.deep;
        }
        var isBtn = true;
        return vm.$watch(function () {
          return watchOption.watch.call(vm);
        }, function (newVal, oldVal) {
          if (isBtn && watchOption.immediate !== true) {
            isBtn = false;
            if (watchOption.value == newVal) {
              return;
            }
          }
          if (typeof watchOption.handler === 'function' && (has(watchOption, 'value') || watchOption.immediate === true)) {
            watchOption.handler.call(vm, newVal, oldVal);
          }
          watchOption.value = newVal;
        }, options);
      });
      this.components.push(vm);
      this.componentsSubs.push(componentsSubs);
    }
  }, {
    key: 'destroy',
    value: function destroy(vm) {
      var index = this.components.indexOf(vm);
      if (index === -1) return;
      this.components.splice(index, 1);
      var componentsSubs = this.componentsSubs.splice(index, 1);
      componentsSubs.forEach(function (componentsSub) {
        componentsSub.forEach(function (unwatch) {
          return unwatch();
        });
      });
    }
  }]);
  return VueWatchComponent;
}();

var toBe = function toBe(vm, callback) {
  var watchComponents = vm.$options.watchComponents;

  if (!isArray(watchComponents)) return;
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
