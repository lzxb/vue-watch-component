(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueWatchComponent = factory());
}(this, (function () { 'use strict';

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

    if (typeof options.watch !== 'function') {
      throw new Error('[vue-watch-component] options.watch must be a function type');
    }
    if (typeof options.handler !== 'function') {
      throw new Error('[vue-watch-component] options.handler must be a function type');
    }
    this.initialOptions = options;
    this.options = _extends({}, options);
    this.vmArr = [];
    this.unwatchArr = [];
  }

  createClass(VueWatchComponent, [{
    key: 'clone',
    value: function clone() {
      return new VueWatchComponent(this.initialOptions);
    }
  }, {
    key: 'init',
    value: function init(vm) {
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
        if (util.has(options, 'value') || options.immediate === true) {
          options.handler.call(vm, newVal, oldVal);
        }
        options.value = newVal;
      }, watchOptions);
      this.vmArr.push(vm);
      this.unwatchArr.push(unwatch);
    }
  }, {
    key: 'destroy',
    value: function destroy(vm) {
      var index = this.vmArr.indexOf(vm);
      this.vmArr.splice(index, 1);
      this.unwatchArr[index]();
      this.unwatchArr.splice(index, 1);
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

VueWatchComponent.version = '0.0.2';

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.Vue) {
  window.Vue.use(VueWatchComponent);
}

return VueWatchComponent;

})));
//# sourceMappingURL=vue-watch-component.js.map
