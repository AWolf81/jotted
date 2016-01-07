(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.Jotted = factory();
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.typeof = function (obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = (function () {
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
  })();

  babelHelpers;
  /* template
   */

  function container() {
    return '\n    <ul class="jotted-nav">\n      <li class="jotted-nav-item jotted-nav-item-result">\n        <a href="#" data-jotted-type="result">\n          Result\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-html">\n        <a href="#" data-jotted-type="html">\n          HTML\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-css">\n        <a href="#" data-jotted-type="css">\n          CSS\n        </a>\n      </li>\n      <li class="jotted-nav-item jotted-nav-item-js">\n        <a href="#" data-jotted-type="js">\n          JavaScript\n        </a>\n      </li>\n    </ul>\n    <div class="jotted-pane jotted-pane-result">\n      <iframe></iframe>\n    </div>\n    <div class="jotted-pane jotted-pane-html"></div>\n    <div class="jotted-pane jotted-pane-css"></div>\n    <div class="jotted-pane jotted-pane-js"></div>\n  ';
  }

  function paneActiveClass(type) {
    return 'jotted-pane-active-' + type;
  }

  function containerClass() {
    return 'jotted';
  }

  function showBlankClass() {
    return 'jotted-nav-show-blank';
  }

  function hasFileClass(type) {
    return 'jotted-has-' + type;
  }

  function editorClass(type) {
    return 'jotted-editor jotted-editor-' + type;
  }

  function editorContent(type) {
    var fileUrl = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    return '\n    <textarea data-jotted-type="' + type + '" data-jotted-file="' + fileUrl + '"></textarea>\n    <div class="jotted-error"></div>\n  ';
  }

  function errorMessage(err) {
    return '\n    <p>' + err + '</p>\n  ';
  }

  function errorClass(type) {
    return 'jotted-error-active-' + type;
  }

  function pluginClass(name) {
    return 'jotted-plugin-' + name;
  }

  function frameContent() {
    return '\n    <!doctype html>\n    <html>\n    <head>\n    </head>\n    <body>\n    </body>\n    </html>\n  ';
  }

  /* util
   */

  function extend() {
    var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var extended = {};
    Object.keys(defaults).forEach(function (key) {
      if (typeof obj[key] !== 'undefined') {
        extended[key] = obj[key];
      } else {
        extended[key] = defaults[key];
      }
    });

    return extended;
  }

  function fetch(file, callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', file);
    xhr.responseType = 'text';

    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        callback(xhr);
      }
    };

    xhr.onerror = function (err) {
      callback(err);
    };

    xhr.send();
  }

  function runCallback(index, params, arr, errors, callback) {
    return function (err, res) {
      if (err) {
        errors.push(err);
      }

      index++;
      if (index === arr.length) {
        callback(errors, res);
      } else {
        seqRunner(index, res, arr, errors, callback);
      }
    };
  }

  function seqRunner(index, params, arr, errors, callback) {
    // async
    arr[index](params, runCallback.apply(this, arguments));
  }

  function seq(arr, params) {
    var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

    var errors = [];

    if (!arr.length) {
      return callback(errors, params);
    }

    seqRunner(0, params, arr, errors, callback);
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var _this = this;

      var args = arguments;
      clearTimeout(timer);

      timer = setTimeout(function () {
        fn.apply(_this, args);
      }, delay);
    };
  }

  function log() {
    console.log(arguments);
  }

  function addClass(node, className) {
    node.className += ' ' + className;

    return node.className;
  }

  function removeClass(node, className) {
    var spaceBefore = ' ' + className;
    var spaceAfter = className + ' ';

    if (node.className.indexOf(spaceBefore) !== -1) {
      node.className = node.className.replace(spaceBefore, '');
    } else if (node.className.indexOf(spaceAfter) !== -1) {
      node.className = node.className.replace(spaceAfter, '');
    } else {
      node.className = node.className.replace(className, '');
    }

    return node.className;
  }

  function data(node, attr) {
    return node.getAttribute('data-' + attr);
  }

  /* re-insert script tags
   */
  function insertScript($script) {
    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    var s = document.createElement('script');
    if ($script.src) {
      s.src = $script.src;
    } else {
      s.textContent = $script.innerText;
    }

    this.$resultFrame.contentWindow.document.head.appendChild(s);

    if ($script.src) {
      s.onload = callback;
    } else {
      callback();
    }
  }

  function runScripts(content) {
    var _this = this;

    /* get scripts tags from content added with innerhtml
     */
    var $scripts = this.$resultFrame.contentWindow.document.querySelectorAll('script');
    var l = $scripts.length;
    var runList = [];

    var _loop = function _loop(i) {
      runList.push(function (params, callback) {
        insertScript.call(_this, $scripts[i], callback);
      });
    };

    for (var i = 0; i < l; i++) {
      _loop(i);
    }

    // insert the script tags sequentially
    // so we preserve execution order
    seq(runList);
  }

  var plugins = [];

  function find(id) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var plugin = _step.value;

        if (plugin._id === id) {
          return plugin;
        }
      }

      // can't find plugin
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    throw new Error('Plugin ' + id + ' is not registered.');
  }

  function register(id, plugin) {
    // private properties
    plugin._id = id;
    plugins.push(plugin);
  }

  // create a new instance of each plugin, on the jotted instance
  function init() {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.options.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var plugin = _step2.value;

        // check if plugin definition is string or object
        var Plugin = undefined;
        var pluginName = undefined;
        var pluginOptions = {};
        if (typeof plugin === 'string') {
          pluginName = plugin;
        } else if ((typeof plugin === 'undefined' ? 'undefined' : babelHelpers.typeof(plugin)) === 'object') {
          pluginName = plugin.name;
          pluginOptions = plugin.options || {};
        }

        Plugin = find(pluginName);
        this.plugins[plugin] = new Plugin(this, pluginOptions);

        addClass(this.$container, pluginClass(pluginName));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  var PubSoup = (function () {
    function PubSoup() {
      babelHelpers.classCallCheck(this, PubSoup);

      this.topics = {};
      this.callbacks = {};
    }

    babelHelpers.createClass(PubSoup, [{
      key: 'find',
      value: function find(query) {
        this.topics[query] = this.topics[query] || [];
        return this.topics[query];
      }
    }, {
      key: 'subscribe',
      value: function subscribe(topic, subscriber) {
        var priority = arguments.length <= 2 || arguments[2] === undefined ? 90 : arguments[2];

        var foundTopic = this.find(topic);
        subscriber._priority = priority;
        foundTopic.push(subscriber);

        // sort subscribers on priority
        foundTopic.sort(function (a, b) {
          return a._priority > b._priority ? 1 : b._priority > a._priority ? -1 : 0;
        });
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(topic, subscriber) {
        var foundTopic = this.find(topic);
        foundTopic.forEach(function (t) {
          // if no subscriber is specified
          // remove all subscribers
          if (!subscriber) {
            t.length = 0;
            return;
          }

          // find the subscriber in the topic
          var index = [].indexOf.call(t, subscriber);

          // show an error if we didn't find the subscriber
          if (index === -1) {
            return log('Subscriber not found in topic');
          }

          t.splice(index, 1);
        });
      }

      // sequentially runs a method on all plugins

    }, {
      key: 'publish',
      value: function publish(topic) {
        var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var foundTopic = this.find(topic);
        var runList = [];

        foundTopic.forEach(function (subscriber) {
          runList.push(subscriber);
        });

        seq(runList, params, this.runCallbacks(topic));
      }

      // parallel run all .done callbacks

    }, {
      key: 'runCallbacks',
      value: function runCallbacks(topic) {
        var pub = this;
        return function () {
          pub.callbacks[topic] = pub.callbacks[topic] || [];

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = pub.callbacks[topic][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var c = _step.value;

              c.apply(this, arguments);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        };
      }

      // attach a callback when a publish[topic] is done

    }, {
      key: 'done',
      value: function done(topic) {
        var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

        this.callbacks[topic] = this.callbacks[topic] || [];
        this.callbacks[topic].push(callback);
      }
    }]);
    return PubSoup;
  })();

  var PluginMarkdown = (function () {
    function PluginMarkdown(jotted, options) {
      babelHelpers.classCallCheck(this, PluginMarkdown);

      var priority = 20;

      this.options = extend(options, {});

      // check if marked is loaded
      if (typeof window.marked === 'undefined') {
        return;
      }

      window.marked.setOptions(options);

      // change html link label
      jotted.$container.querySelector('a[data-jotted-type="html"]').innerHTML = 'Markdown';

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginMarkdown, [{
      key: 'change',
      value: function change(params, callback) {
        // only parse html content
        if (params.type === 'html') {
          try {
            params.content = window.marked(params.content);
          } catch (err) {
            return callback(err, params);
          }

          callback(null, params);
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginMarkdown;
  })();

  var PluginBabel = (function () {
    function PluginBabel(jotted, options) {
      babelHelpers.classCallCheck(this, PluginBabel);

      var priority = 20;

      this.options = extend(options, {
        presets: ['es2015']
      });

      // check if babel is loaded
      if (typeof window.Babel === 'undefined') {
        return;
      }

      // change js link label
      jotted.$container.querySelector('a[data-jotted-type="js"]').innerHTML = 'ES6';

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginBabel, [{
      key: 'change',
      value: function change(params, callback) {
        // only parse js content
        if (params.type === 'js') {
          try {
            params.content = window.Babel.transform(params.content, this.options).code;
          } catch (err) {
            return callback(err, params);
          }

          callback(null, params);
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginBabel;
  })();

  var PluginStylus = (function () {
    function PluginStylus(jotted, options) {
      babelHelpers.classCallCheck(this, PluginStylus);

      var priority = 20;

      options = extend(options, {});

      // check if stylus is loaded
      if (typeof window.stylus === 'undefined') {
        return;
      }

      // change CSS link label to Stylus
      jotted.$container.querySelector('a[data-jotted-type="css"]').innerHTML = 'Stylus';

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginStylus, [{
      key: 'isStylus',
      value: function isStylus(params) {
        if (params.type !== 'css') {
          return false;
        }

        return params.file.indexOf('.styl') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .styl and blank files
        if (this.isStylus(params)) {
          window.stylus(params.content, this.options).render(function (err, res) {
            if (err) {
              return callback(err, params);
            } else {
              // replace the content with the parsed less
              params.content = res;
            }

            callback(null, params);
          });
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginStylus;
  })();

  var PluginCoffeeScript = (function () {
    function PluginCoffeeScript(jotted, options) {
      babelHelpers.classCallCheck(this, PluginCoffeeScript);

      var priority = 20;

      options = extend(options, {});

      // check if coffeescript is loaded
      if (typeof window.CoffeeScript === 'undefined') {
        return;
      }

      // change JS link label to Less
      jotted.$container.querySelector('a[data-jotted-type="js"]').innerHTML = 'CoffeeScript';

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginCoffeeScript, [{
      key: 'isCoffee',
      value: function isCoffee(params) {
        if (params.type !== 'js') {
          return false;
        }

        return params.file.indexOf('.coffee') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .less and blank files
        if (this.isCoffee(params)) {
          try {
            params.content = window.CoffeeScript.compile(params.content);
          } catch (err) {
            return callback(err, params);
          }
        }

        callback(null, params);
      }
    }]);
    return PluginCoffeeScript;
  })();

  var PluginLess = (function () {
    function PluginLess(jotted, options) {
      babelHelpers.classCallCheck(this, PluginLess);

      var priority = 20;

      options = extend(options, {});

      // check if less is loaded
      if (typeof window.less === 'undefined') {
        return;
      }

      // change CSS link label to Less
      jotted.$container.querySelector('a[data-jotted-type="css"]').innerHTML = 'Less';

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginLess, [{
      key: 'isLess',
      value: function isLess(params) {
        if (params.type !== 'css') {
          return false;
        }

        return params.file.indexOf('.less') !== -1 || params.file === '';
      }
    }, {
      key: 'change',
      value: function change(params, callback) {
        // only parse .less and blank files
        if (this.isLess(params)) {
          window.less.render(params.content, this.options, function (err, res) {
            if (err) {
              return callback(err, params);
            } else {
              // replace the content with the parsed less
              params.content = res.css;
            }

            callback(null, params);
          });
        } else {
          // make sure we callback either way,
          // to not break the pubsoup
          callback(null, params);
        }
      }
    }]);
    return PluginLess;
  })();

  var PluginAce = (function () {
    function PluginAce(jotted, options) {
      var _this = this;

      babelHelpers.classCallCheck(this, PluginAce);

      var priority = 1;
      var i;

      this.editor = {};

      this.modemap = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'less': 'less',
        'coffee': 'coffeescript'
      };

      options = extend(options, {});

      // check if Ace is loaded
      if (typeof window.ace === 'undefined') {
        return;
      }

      var $editors = jotted.$container.querySelectorAll('.jotted-editor');

      var _loop = function _loop() {
        var $textarea = $editors[i].querySelector('textarea');
        var type = data($textarea, 'jotted-type');
        var file = data($textarea, 'jotted-file');

        var $aceContainer = document.createElement('div');
        $editors[i].appendChild($aceContainer);

        _this.editor[type] = window.ace.edit($aceContainer);
        var editor = _this.editor[type];

        var editorOptions = extend(options);

        editor.getSession().setMode(_this.aceMode(type, file));
        editor.getSession().setOptions(editorOptions);

        editor.$blockScrolling = Infinity;

        editor.on('change', function () {
          $textarea.value = editor.getValue();

          // trigger a change event
          jotted.trigger('change', {
            aceEditor: editor,
            type: type,
            file: file,
            content: $textarea.value
          });
        });
      };

      for (i = 0; i < $editors.length; i++) {
        _loop();
      }

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginAce, [{
      key: 'change',
      value: function change(params, callback) {
        var editor = this.editor[params.type];

        // if the event is not started by the ace change
        if (!params.aceEditor) {
          editor.getSession().setValue(params.content);
        }

        // manipulate the params and pass them on
        params.content = editor.getValue();
        callback(null, params);
      }
    }, {
      key: 'aceMode',
      value: function aceMode(type, file) {
        var mode = 'ace/mode/';

        // try the file extension
        for (var key in this.modemap) {
          if (file.indexOf('.' + key) !== -1) {
            return mode + this.modemap[key];
          }
        }

        // try the file type (html/css/js)
        for (var key in this.modemap) {
          if (type === key) {
            return mode + this.modemap[key];
          }
        }

        return mode + type;
      }
    }]);
    return PluginAce;
  })();

  var PluginCodeMirror = (function () {
    function PluginCodeMirror(jotted, options) {
      var _this = this;

      babelHelpers.classCallCheck(this, PluginCodeMirror);

      var priority = 1;
      var i;

      this.editor = {};

      options = extend(options, {
        lineNumbers: true
      });

      // check if CodeMirror is loaded
      if (typeof window.CodeMirror === 'undefined') {
        return;
      }

      var $editors = jotted.$container.querySelectorAll('.jotted-editor');

      var _loop = function _loop() {
        var $textarea = $editors[i].querySelector('textarea');
        var type = data($textarea, 'jotted-type');
        var file = data($textarea, 'jotted-file');

        _this.editor[type] = window.CodeMirror.fromTextArea($textarea, options);
        var editor = _this.editor[type];

        editor.on('change', function () {
          $textarea.value = editor.getValue();

          // trigger a change event
          jotted.trigger('change', {
            cmEditor: editor,
            type: type,
            file: file,
            content: $textarea.value
          });
        });
      };

      for (i = 0; i < $editors.length; i++) {
        _loop();
      }

      jotted.on('change', this.change.bind(this), priority);
    }

    babelHelpers.createClass(PluginCodeMirror, [{
      key: 'change',
      value: function change(params, callback) {
        var editor = this.editor[params.type];

        // if the event is not started by the codemirror change
        if (!params.cmEditor) {
          editor.setValue(params.content);
        }

        // manipulate the params and pass them on
        params.content = editor.getValue();
        callback(null, params);
      }
    }]);
    return PluginCodeMirror;
  })();

  function BundlePlugins(jotted) {
    jotted.plugin('codemirror', PluginCodeMirror);
    jotted.plugin('ace', PluginAce);
    jotted.plugin('less', PluginLess);
    jotted.plugin('coffeescript', PluginCoffeeScript);
    jotted.plugin('stylus', PluginStylus);
    jotted.plugin('babel', PluginBabel);
    jotted.plugin('markdown', PluginMarkdown);
  }

  !function e(t,n,r){function s(i,u){if(!n[i]){if(!t[i]){var c="function"==typeof require&&require;if(!u&&c)return c(i,!0);if(o)return o(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var f=n[i]={exports:{}};t[i][0].call(f.exports,function(n){var e=t[i][1][n];return s(e?e:n)},f,f.exports,e,t,n,r)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)s(r[i]);return s}({1:[function(t,n,e){(function(n){"use strict";if(t(189),t(2),n._babelPolyfill)throw new Error("only one instance of babel-polyfill is allowed");n._babelPolyfill=!0}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{189:189,2:2}],2:[function(t,n,e){n.exports=t(190)},{190:190}],3:[function(t,n,e){n.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},{}],4:[function(t,n,e){var r=t(84)("unscopables"),o=Array.prototype;void 0==o[r]&&t(32)(o,r,{}),n.exports=function(t){o[r][t]=!0}},{32:32,84:84}],5:[function(t,n,e){var r=t(39);n.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},{39:39}],6:[function(t,n,e){"use strict";var r=t(81),o=t(77),i=t(80);n.exports=[].copyWithin||function copyWithin(t,n){var e=r(this),u=i(e.length),c=o(t,u),a=o(n,u),s=arguments,f=s.length>2?s[2]:void 0,l=Math.min((void 0===f?u:o(f,u))-a,u-c),h=1;for(c>a&&a+l>c&&(h=-1,a+=l-1,c+=l-1);l-- >0;)a in e?e[c]=e[a]:delete e[c],c+=h,a+=h;return e}},{77:77,80:80,81:81}],7:[function(t,n,e){"use strict";var r=t(81),o=t(77),i=t(80);n.exports=[].fill||function fill(t){for(var n=r(this,!0),e=i(n.length),u=arguments,c=u.length,a=o(c>1?u[1]:void 0,e),s=c>2?u[2]:void 0,f=void 0===s?e:o(s,e);f>a;)n[a++]=t;return n}},{77:77,80:80,81:81}],8:[function(t,n,e){var r=t(79),o=t(80),i=t(77);n.exports=function(t){return function(n,e,u){var c,a=r(n),s=o(a.length),f=i(u,s);if(t&&e!=e){for(;s>f;)if(c=a[f++],c!=c)return!0}else for(;s>f;f++)if((t||f in a)&&a[f]===e)return t||f;return!t&&-1}}},{77:77,79:79,80:80}],9:[function(t,n,e){var r=t(18),o=t(35),i=t(81),u=t(80),c=t(10);n.exports=function(t){var n=1==t,e=2==t,a=3==t,s=4==t,f=6==t,l=5==t||f;return function(h,p,v){for(var g,y,d=i(h),m=o(d),x=r(p,v,3),S=u(m.length),b=0,w=n?c(h,S):e?c(h,0):void 0;S>b;b++)if((l||b in m)&&(g=m[b],y=x(g,b,d),t))if(n)w[b]=y;else if(y)switch(t){case 3:return!0;case 5:return g;case 6:return b;case 2:w.push(g)}else if(s)return!1;return f?-1:a||s?s:w}}},{10:10,18:18,35:35,80:80,81:81}],10:[function(t,n,e){var r=t(39),o=t(37),i=t(84)("species");n.exports=function(t,n){var e;return o(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!o(e.prototype)||(e=void 0),r(e)&&(e=e[i],null===e&&(e=void 0))),new(void 0===e?Array:e)(n)}},{37:37,39:39,84:84}],11:[function(t,n,e){var r=t(12),o=t(84)("toStringTag"),i="Arguments"==r(function(){return arguments}());n.exports=function(t){var n,e,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=(n=Object(t))[o])?e:i?r(n):"Object"==(u=r(n))&&"function"==typeof n.callee?"Arguments":u}},{12:12,84:84}],12:[function(t,n,e){var r={}.toString;n.exports=function(t){return r.call(t).slice(8,-1)}},{}],13:[function(t,n,e){"use strict";var r=t(47),o=t(32),i=t(54),u=t(18),c=t(70),a=t(20),s=t(28),f=t(43),l=t(45),h=t(83)("id"),p=t(31),v=t(39),g=t(66),y=t(21),d=Object.isExtensible||v,m=y?"_s":"size",x=0,S=function(t,n){if(!v(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!p(t,h)){if(!d(t))return"F";if(!n)return"E";o(t,h,++x)}return"O"+t[h]},b=function(t,n){var e,r=S(n);if("F"!==r)return t._i[r];for(e=t._f;e;e=e.n)if(e.k==n)return e};n.exports={getConstructor:function(t,n,e,o){var f=t(function(t,i){c(t,f,n),t._i=r.create(null),t._f=void 0,t._l=void 0,t[m]=0,void 0!=i&&s(i,e,t[o],t)});return i(f.prototype,{clear:function clear(){for(var t=this,n=t._i,e=t._f;e;e=e.n)e.r=!0,e.p&&(e.p=e.p.n=void 0),delete n[e.i];t._f=t._l=void 0,t[m]=0},"delete":function(t){var n=this,e=b(n,t);if(e){var r=e.n,o=e.p;delete n._i[e.i],e.r=!0,o&&(o.n=r),r&&(r.p=o),n._f==e&&(n._f=r),n._l==e&&(n._l=o),n[m]--}return!!e},forEach:function forEach(t){for(var n,e=u(t,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(e(n.v,n.k,this);n&&n.r;)n=n.p},has:function has(t){return!!b(this,t)}}),y&&r.setDesc(f.prototype,"size",{get:function(){return a(this[m])}}),f},def:function(t,n,e){var r,o,i=b(t,n);return i?i.v=e:(t._l=i={i:o=S(n,!0),k:n,v:e,p:r=t._l,n:void 0,r:!1},t._f||(t._f=i),r&&(r.n=i),t[m]++,"F"!==o&&(t._i[o]=i)),t},getEntry:b,setStrong:function(t,n,e){f(t,n,function(t,n){this._t=t,this._k=n,this._l=void 0},function(){for(var t=this,n=t._k,e=t._l;e&&e.r;)e=e.p;return t._t&&(t._l=e=e?e.n:t._t._f)?"keys"==n?l(0,e.k):"values"==n?l(0,e.v):l(0,[e.k,e.v]):(t._t=void 0,l(1))},e?"entries":"values",!e,!0),g(n)}}},{18:18,20:20,21:21,28:28,31:31,32:32,39:39,43:43,45:45,47:47,54:54,66:66,70:70,83:83}],14:[function(t,n,e){var r=t(28),o=t(11);n.exports=function(t){return function toJSON(){if(o(this)!=t)throw TypeError(t+"#toJSON isn't generic");var n=[];return r(this,!1,n.push,n),n}}},{11:11,28:28}],15:[function(t,n,e){"use strict";var r=t(32),o=t(54),i=t(5),u=t(70),c=t(28),a=t(9),s=t(83)("weak"),f=t(39),l=t(31),h=Object.isExtensible||f,p=a(5),v=a(6),g=0,y=function(t){return t._l||(t._l=new d)},d=function(){this.a=[]},m=function(t,n){return p(t.a,function(t){return t[0]===n})};d.prototype={get:function(t){var n=m(this,t);return n?n[1]:void 0},has:function(t){return!!m(this,t)},set:function(t,n){var e=m(this,t);e?e[1]=n:this.a.push([t,n])},"delete":function(t){var n=v(this.a,function(n){return n[0]===t});return~n&&this.a.splice(n,1),!!~n}},n.exports={getConstructor:function(t,n,e,r){var i=t(function(t,o){u(t,i,n),t._i=g++,t._l=void 0,void 0!=o&&c(o,e,t[r],t)});return o(i.prototype,{"delete":function(t){return f(t)?h(t)?l(t,s)&&l(t[s],this._i)&&delete t[s][this._i]:y(this)["delete"](t):!1},has:function has(t){return f(t)?h(t)?l(t,s)&&l(t[s],this._i):y(this).has(t):!1}}),i},def:function(t,n,e){return h(i(n))?(l(n,s)||r(n,s,{}),n[s][t._i]=e):y(t).set(n,e),t},frozenStore:y,WEAK:s}},{28:28,31:31,32:32,39:39,5:5,54:54,70:70,83:83,9:9}],16:[function(t,n,e){"use strict";var r=t(30),o=t(19),i=t(62),u=t(54),c=t(28),a=t(70),s=t(39),f=t(25),l=t(44),h=t(67);n.exports=function(t,n,e,p,v,g){var y=r[t],d=y,m=v?"set":"add",x=d&&d.prototype,S={},b=function(t){var n=x[t];i(x,t,"delete"==t?function(t){return g&&!s(t)?!1:n.call(this,0===t?0:t)}:"has"==t?function has(t){return g&&!s(t)?!1:n.call(this,0===t?0:t)}:"get"==t?function get(t){return g&&!s(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function add(t){return n.call(this,0===t?0:t),this}:function set(t,e){return n.call(this,0===t?0:t,e),this})};if("function"==typeof d&&(g||x.forEach&&!f(function(){(new d).entries().next()}))){var w,E=new d,O=E[m](g?{}:-0,1)!=E,P=f(function(){E.has(1)}),_=l(function(t){new d(t)});_||(d=n(function(n,e){a(n,d,t);var r=new y;return void 0!=e&&c(e,v,r[m],r),r}),d.prototype=x,x.constructor=d),g||E.forEach(function(t,n){w=1/n===-(1/0)}),(P||w)&&(b("delete"),b("has"),v&&b("get")),(w||O)&&b(m),g&&x.clear&&delete x.clear}else d=p.getConstructor(n,t,v,m),u(d.prototype,e);return h(d,t),S[t]=d,o(o.G+o.W+o.F*(d!=y),S),g||p.setStrong(d,t,v),d}},{19:19,25:25,28:28,30:30,39:39,44:44,54:54,62:62,67:67,70:70}],17:[function(t,n,e){var r=n.exports={version:"1.2.5"};"number"==typeof __e&&(__e=r)},{}],18:[function(t,n,e){var r=t(3);n.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},{3:3}],19:[function(t,n,e){var r=t(30),o=t(17),i=t(32),u=t(62),c="prototype",a=function(t,n){return function(){return t.apply(n,arguments)}},s=function(t,n,e){var f,l,h,p,v=t&s.G,g=t&s.P,y=v?r:t&s.S?r[n]||(r[n]={}):(r[n]||{})[c],d=v?o:o[n]||(o[n]={});v&&(e=n);for(f in e)l=!(t&s.F)&&y&&f in y,h=(l?y:e)[f],p=t&s.B&&l?a(h,r):g&&"function"==typeof h?a(Function.call,h):h,y&&!l&&u(y,f,h),d[f]!=h&&i(d,f,p),g&&((d[c]||(d[c]={}))[f]=h)};r.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,n.exports=s},{17:17,30:30,32:32,62:62}],20:[function(t,n,e){n.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},{}],21:[function(t,n,e){n.exports=!t(25)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{25:25}],22:[function(t,n,e){var r=t(39),o=t(30).document,i=r(o)&&r(o.createElement);n.exports=function(t){return i?o.createElement(t):{}}},{30:30,39:39}],23:[function(t,n,e){var r=t(47);n.exports=function(t){var n=r.getKeys(t),e=r.getSymbols;if(e)for(var o,i=e(t),u=r.isEnum,c=0;i.length>c;)u.call(t,o=i[c++])&&n.push(o);return n}},{47:47}],24:[function(t,n,e){var r=t(84)("match");n.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r]=!1,!"/./"[t](n)}catch(o){}}return!0}},{84:84}],25:[function(t,n,e){n.exports=function(t){try{return!!t()}catch(n){return!0}}},{}],26:[function(t,n,e){"use strict";var r=t(32),o=t(62),i=t(25),u=t(20),c=t(84);n.exports=function(t,n,e){var a=c(t),s=""[t];i(function(){var n={};return n[a]=function(){return 7},7!=""[t](n)})&&(o(String.prototype,t,e(u,a,s)),r(RegExp.prototype,a,2==n?function(t,n){return s.call(t,this,n)}:function(t){return s.call(t,this)}))}},{20:20,25:25,32:32,62:62,84:84}],27:[function(t,n,e){"use strict";var r=t(5);n.exports=function(){var t=r(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},{5:5}],28:[function(t,n,e){var r=t(18),o=t(41),i=t(36),u=t(5),c=t(80),a=t(85);n.exports=function(t,n,e,s){var f,l,h,p=a(t),v=r(e,s,n?2:1),g=0;if("function"!=typeof p)throw TypeError(t+" is not iterable!");if(i(p))for(f=c(t.length);f>g;g++)n?v(u(l=t[g])[0],l[1]):v(t[g]);else for(h=p.call(t);!(l=h.next()).done;)o(h,v,l.value,n)}},{18:18,36:36,41:41,5:5,80:80,85:85}],29:[function(t,n,e){var r={}.toString,o=t(79),i=t(47).getNames,u="object"==typeof window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(t){try{return i(t)}catch(n){return u.slice()}};n.exports.get=function getOwnPropertyNames(t){return u&&"[object Window]"==r.call(t)?c(t):i(o(t))}},{47:47,79:79}],30:[function(t,n,e){var r=n.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},{}],31:[function(t,n,e){var r={}.hasOwnProperty;n.exports=function(t,n){return r.call(t,n)}},{}],32:[function(t,n,e){var r=t(47),o=t(61);n.exports=t(21)?function(t,n,e){return r.setDesc(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},{21:21,47:47,61:61}],33:[function(t,n,e){n.exports=t(30).document&&document.documentElement},{30:30}],34:[function(t,n,e){n.exports=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)}},{}],35:[function(t,n,e){var r=t(12);n.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},{12:12}],36:[function(t,n,e){var r=t(46),o=t(84)("iterator"),i=Array.prototype;n.exports=function(t){return(r.Array||i[o])===t}},{46:46,84:84}],37:[function(t,n,e){var r=t(12);n.exports=Array.isArray||function(t){return"Array"==r(t)}},{12:12}],38:[function(t,n,e){var r=t(39),o=Math.floor;n.exports=function isInteger(t){return!r(t)&&isFinite(t)&&o(t)===t}},{39:39}],39:[function(t,n,e){n.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},{}],40:[function(t,n,e){var r=t(39),o=t(12),i=t(84)("match");n.exports=function(t){var n;return r(t)&&(void 0!==(n=t[i])?!!n:"RegExp"==o(t))}},{12:12,39:39,84:84}],41:[function(t,n,e){var r=t(5);n.exports=function(t,n,e,o){try{return o?n(r(e)[0],e[1]):n(e)}catch(i){var u=t["return"];throw void 0!==u&&r(u.call(t)),i}}},{5:5}],42:[function(t,n,e){"use strict";var r=t(47),o=t(61),i=t(67),u={};t(32)(u,t(84)("iterator"),function(){return this}),n.exports=function(t,n,e){t.prototype=r.create(u,{next:o(1,e)}),i(t,n+" Iterator")}},{32:32,47:47,61:61,67:67,84:84}],43:[function(t,n,e){"use strict";var r=t(49),o=t(19),i=t(62),u=t(32),c=t(31),a=t(84)("iterator"),s=t(46),f=t(42),l=t(67),h=t(47).getProto,p=!([].keys&&"next"in[].keys()),v="@@iterator",g="keys",y="values",d=function(){return this};n.exports=function(t,n,e,m,x,S,b){f(e,n,m);var w,E,O=function(t){if(!p&&t in _)return _[t];switch(t){case g:return function keys(){return new e(this,t)};case y:return function values(){return new e(this,t)}}return function entries(){return new e(this,t)}},P=n+" Iterator",_=t.prototype,M=_[a]||_[v]||x&&_[x],F=M||O(x);if(M){var A=h(F.call(new t));l(A,P,!0),!r&&c(_,v)&&u(A,a,d)}if(r&&!b||!p&&a in _||u(_,a,F),s[n]=F,s[P]=d,x)if(w={values:x==y?F:O(y),keys:S?F:O(g),entries:x!=y?F:O("entries")},b)for(E in w)E in _||i(_,E,w[E]);else o(o.P+o.F*p,n,w);return w}},{19:19,31:31,32:32,42:42,46:46,47:47,49:49,62:62,67:67,84:84}],44:[function(t,n,e){var r=t(84)("iterator"),o=!1;try{var i=[7][r]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(u){}n.exports=function(t,n){if(!n&&!o)return!1;var e=!1;try{var i=[7],u=i[r]();u.next=function(){e=!0},i[r]=function(){return u},t(i)}catch(c){}return e}},{84:84}],45:[function(t,n,e){n.exports=function(t,n){return{value:n,done:!!t}}},{}],46:[function(t,n,e){n.exports={}},{}],47:[function(t,n,e){var r=Object;n.exports={create:r.create,getProto:r.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:r.getOwnPropertyDescriptor,setDesc:r.defineProperty,setDescs:r.defineProperties,getKeys:r.keys,getNames:r.getOwnPropertyNames,getSymbols:r.getOwnPropertySymbols,each:[].forEach}},{}],48:[function(t,n,e){var r=t(47),o=t(79);n.exports=function(t,n){for(var e,i=o(t),u=r.getKeys(i),c=u.length,a=0;c>a;)if(i[e=u[a++]]===n)return e}},{47:47,79:79}],49:[function(t,n,e){n.exports=!1},{}],50:[function(t,n,e){n.exports=Math.expm1||function expm1(t){return 0==(t=+t)?t:t>-1e-6&&1e-6>t?t+t*t/2:Math.exp(t)-1}},{}],51:[function(t,n,e){n.exports=Math.log1p||function log1p(t){return(t=+t)>-1e-8&&1e-8>t?t-t*t/2:Math.log(1+t)}},{}],52:[function(t,n,e){n.exports=Math.sign||function sign(t){return 0==(t=+t)||t!=t?t:0>t?-1:1}},{}],53:[function(t,n,e){var r,o,i,u=t(30),c=t(76).set,a=u.MutationObserver||u.WebKitMutationObserver,s=u.process,f="process"==t(12)(s),l=function(){var t,n;for(f&&(t=s.domain)&&(s.domain=null,t.exit());r;)n=r.domain,n&&n.enter(),r.fn.call(),n&&n.exit(),r=r.next;o=void 0,t&&t.enter()};if(f)i=function(){s.nextTick(l)};else if(a){var h=1,p=document.createTextNode("");new a(l).observe(p,{characterData:!0}),i=function(){p.data=h=-h}}else i=function(){c.call(u,l)};n.exports=function asap(t){var n={fn:t,next:void 0,domain:f&&s.domain};o&&(o.next=n),r||(r=n,i()),o=n}},{12:12,30:30,76:76}],54:[function(t,n,e){var r=t(62);n.exports=function(t,n){for(var e in n)r(t,e,n[e]);return t}},{62:62}],55:[function(t,n,e){var r=t(47),o=t(81),i=t(35);n.exports=t(25)(function(){var t=Object.assign,n={},e={},r=Symbol(),o="abcdefghijklmnopqrst";return n[r]=7,o.split("").forEach(function(t){e[t]=t}),7!=t({},n)[r]||Object.keys(t({},e)).join("")!=o})?function assign(t,n){for(var e=o(t),u=arguments,c=u.length,a=1,s=r.getKeys,f=r.getSymbols,l=r.isEnum;c>a;)for(var h,p=i(u[a++]),v=f?s(p).concat(f(p)):s(p),g=v.length,y=0;g>y;)l.call(p,h=v[y++])&&(e[h]=p[h]);return e}:Object.assign},{25:25,35:35,47:47,81:81}],56:[function(t,n,e){var r=(t(19),t(17)),o=t(25);n.exports=function(n,e){var i=t(19),u=(r.Object||{})[n]||Object[n],c={};c[n]=e(u),i(i.S+i.F*o(function(){u(1)}),"Object",c)}},{17:17,19:19,25:25}],57:[function(t,n,e){var r=t(47),o=t(79),i=r.isEnum;n.exports=function(t){return function(n){for(var e,u=o(n),c=r.getKeys(u),a=c.length,s=0,f=[];a>s;)i.call(u,e=c[s++])&&f.push(t?[e,u[e]]:u[e]);return f}}},{47:47,79:79}],58:[function(t,n,e){var r=t(47),o=t(5),i=t(30).Reflect;n.exports=i&&i.ownKeys||function ownKeys(t){var n=r.getNames(o(t)),e=r.getSymbols;return e?n.concat(e(t)):n}},{30:30,47:47,5:5}],59:[function(t,n,e){"use strict";var r=t(60),o=t(34),i=t(3);n.exports=function(){for(var t=i(this),n=arguments.length,e=Array(n),u=0,c=r._,a=!1;n>u;)(e[u]=arguments[u++])===c&&(a=!0);return function(){var r,i=this,u=arguments,s=u.length,f=0,l=0;if(!a&&!s)return o(t,e,i);if(r=e.slice(),a)for(;n>f;f++)r[f]===c&&(r[f]=u[l++]);for(;s>l;)r.push(u[l++]);return o(t,r,i)}}},{3:3,34:34,60:60}],60:[function(t,n,e){n.exports=t(30)},{30:30}],61:[function(t,n,e){n.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},{}],62:[function(t,n,e){var r=t(30),o=t(32),i=t(83)("src"),u="toString",c=Function[u],a=(""+c).split(u);t(17).inspectSource=function(t){return c.call(t)},(n.exports=function(t,n,e,u){"function"==typeof e&&(e.hasOwnProperty(i)||o(e,i,t[n]?""+t[n]:a.join(String(n))),e.hasOwnProperty("name")||o(e,"name",n)),t===r?t[n]=e:(u||delete t[n],o(t,n,e))})(Function.prototype,u,function toString(){return"function"==typeof this&&this[i]||c.call(this)})},{17:17,30:30,32:32,83:83}],63:[function(t,n,e){n.exports=function(t,n){var e=n===Object(n)?function(t){return n[t]}:n;return function(n){return String(n).replace(t,e)}}},{}],64:[function(t,n,e){n.exports=Object.is||function is(t,n){return t===n?0!==t||1/t===1/n:t!=t&&n!=n}},{}],65:[function(t,n,e){var r=t(47).getDesc,o=t(39),i=t(5),u=function(t,n){if(i(t),!o(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};n.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(n,e,o){try{o=t(18)(Function.call,r(Object.prototype,"__proto__").set,2),o(n,[]),e=!(n instanceof Array)}catch(i){e=!0}return function setPrototypeOf(t,n){return u(t,n),e?t.__proto__=n:o(t,n),t}}({},!1):void 0),check:u}},{18:18,39:39,47:47,5:5}],66:[function(t,n,e){"use strict";var r=t(30),o=t(47),i=t(21),u=t(84)("species");n.exports=function(t){var n=r[t];i&&n&&!n[u]&&o.setDesc(n,u,{configurable:!0,get:function(){return this}})}},{21:21,30:30,47:47,84:84}],67:[function(t,n,e){var r=t(47).setDesc,o=t(31),i=t(84)("toStringTag");n.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},{31:31,47:47,84:84}],68:[function(t,n,e){var r=t(30),o="__core-js_shared__",i=r[o]||(r[o]={});n.exports=function(t){return i[t]||(i[t]={})}},{30:30}],69:[function(t,n,e){var r=t(5),o=t(3),i=t(84)("species");n.exports=function(t,n){var e,u=r(t).constructor;return void 0===u||void 0==(e=r(u)[i])?n:o(e)}},{3:3,5:5,84:84}],70:[function(t,n,e){n.exports=function(t,n,e){if(!(t instanceof n))throw TypeError(e+": use the 'new' operator!");return t}},{}],71:[function(t,n,e){var r=t(78),o=t(20);n.exports=function(t){return function(n,e){var i,u,c=String(o(n)),a=r(e),s=c.length;return 0>a||a>=s?t?"":void 0:(i=c.charCodeAt(a),55296>i||i>56319||a+1===s||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):(i-55296<<10)+(u-56320)+65536)}}},{20:20,78:78}],72:[function(t,n,e){var r=t(40),o=t(20);n.exports=function(t,n,e){if(r(n))throw TypeError("String#"+e+" doesn't accept regex!");return String(o(t))}},{20:20,40:40}],73:[function(t,n,e){var r=t(80),o=t(74),i=t(20);n.exports=function(t,n,e,u){var c=String(i(t)),a=c.length,s=void 0===e?" ":String(e),f=r(n);if(a>=f)return c;""==s&&(s=" ");var l=f-a,h=o.call(s,Math.ceil(l/s.length));return h.length>l&&(h=h.slice(0,l)),u?h+c:c+h}},{20:20,74:74,80:80}],74:[function(t,n,e){"use strict";var r=t(78),o=t(20);n.exports=function repeat(t){var n=String(o(this)),e="",i=r(t);if(0>i||i==1/0)throw RangeError("Count can't be negative");for(;i>0;(i>>>=1)&&(n+=n))1&i&&(e+=n);return e}},{20:20,78:78}],75:[function(t,n,e){var r=t(19),o=t(20),i=t(25),u="	\n\x0B\f\r   ᠎             　\u2028\u2029\ufeff",c="["+u+"]",a="​",s=RegExp("^"+c+c+"*"),f=RegExp(c+c+"*$"),l=function(t,n){var e={};e[t]=n(h),r(r.P+r.F*i(function(){return!!u[t]()||a[t]()!=a}),"String",e)},h=l.trim=function(t,n){return t=String(o(t)),1&n&&(t=t.replace(s,"")),2&n&&(t=t.replace(f,"")),t};n.exports=l},{19:19,20:20,25:25}],76:[function(t,n,e){"use strict";var r,o,i,u=t(18),c=t(34),a=t(33),s=t(22),f=t(30),l=f.process,h=f.setImmediate,p=f.clearImmediate,v=f.MessageChannel,g=0,y={},d="onreadystatechange",m=function(){var t=+this;if(y.hasOwnProperty(t)){var n=y[t];delete y[t],n()}},x=function(t){m.call(t.data)};h&&p||(h=function setImmediate(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return y[++g]=function(){c("function"==typeof t?t:Function(t),n)},r(g),g},p=function clearImmediate(t){delete y[t]},"process"==t(12)(l)?r=function(t){l.nextTick(u(m,t,1))}:v?(o=new v,i=o.port2,o.port1.onmessage=x,r=u(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",x,!1)):r=d in s("script")?function(t){a.appendChild(s("script"))[d]=function(){a.removeChild(this),m.call(t)}}:function(t){setTimeout(u(m,t,1),0)}),n.exports={set:h,clear:p}},{12:12,18:18,22:22,30:30,33:33,34:34}],77:[function(t,n,e){var r=t(78),o=Math.max,i=Math.min;n.exports=function(t,n){return t=r(t),0>t?o(t+n,0):i(t,n)}},{78:78}],78:[function(t,n,e){var r=Math.ceil,o=Math.floor;n.exports=function(t){return isNaN(t=+t)?0:(t>0?o:r)(t)}},{}],79:[function(t,n,e){var r=t(35),o=t(20);n.exports=function(t){return r(o(t))}},{20:20,35:35}],80:[function(t,n,e){var r=t(78),o=Math.min;n.exports=function(t){return t>0?o(r(t),9007199254740991):0}},{78:78}],81:[function(t,n,e){var r=t(20);n.exports=function(t){return Object(r(t))}},{20:20}],82:[function(t,n,e){var r=t(39);n.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},{39:39}],83:[function(t,n,e){var r=0,o=Math.random();n.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++r+o).toString(36))}},{}],84:[function(t,n,e){var r=t(68)("wks"),o=t(83),i=t(30).Symbol;n.exports=function(t){return r[t]||(r[t]=i&&i[t]||(i||o)("Symbol."+t))}},{30:30,68:68,83:83}],85:[function(t,n,e){var r=t(11),o=t(84)("iterator"),i=t(46);n.exports=t(17).getIteratorMethod=function(t){return void 0!=t?t[o]||t["@@iterator"]||i[r(t)]:void 0}},{11:11,17:17,46:46,84:84}],86:[function(t,n,e){"use strict";var r,o=t(47),i=t(21),u=t(61),c=t(33),a=t(22),s=t(31),f=t(12),l=t(19),h=t(34),p=t(9),v=t(83)("__proto__"),g=t(39),y=t(5),d=t(3),m=t(81),x=t(79),S=t(78),b=t(77),w=t(80),E=t(35),O=t(25),P=Object.prototype,_=[],M=_.slice,F=_.join,A=o.setDesc,j=o.getDesc,N=o.setDescs,I=t(8)(!1),k={};i||(r=!O(function(){return 7!=A(a("div"),"a",{get:function(){return 7}}).a}),o.setDesc=function(t,n,e){if(r)try{return A(t,n,e)}catch(o){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(y(t)[n]=e.value),t},o.getDesc=function(t,n){if(r)try{return j(t,n)}catch(e){}return s(t,n)?u(!P.propertyIsEnumerable.call(t,n),t[n]):void 0},o.setDescs=N=function(t,n){y(t);for(var e,r=o.getKeys(n),i=r.length,u=0;i>u;)o.setDesc(t,e=r[u++],n[e]);return t}),l(l.S+l.F*!i,"Object",{getOwnPropertyDescriptor:o.getDesc,defineProperty:o.setDesc,defineProperties:N});var D="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),T=D.concat("length","prototype"),L=D.length,R=function(){var t,n=a("iframe"),e=L,r=">";for(n.style.display="none",c.appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write("<script>document.F=Object</script"+r),t.close(),R=t.F;e--;)delete R.prototype[D[e]];return R()},C=function(t,n){return function(e){var r,o=x(e),i=0,u=[];for(r in o)r!=v&&s(o,r)&&u.push(r);for(;n>i;)s(o,r=t[i++])&&(~I(u,r)||u.push(r));return u}},G=function(){};l(l.S,"Object",{getPrototypeOf:o.getProto=o.getProto||function(t){return t=m(t),s(t,v)?t[v]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?P:null},getOwnPropertyNames:o.getNames=o.getNames||C(T,T.length,!0),create:o.create=o.create||function(t,n){var e;return null!==t?(G.prototype=y(t),e=new G,G.prototype=null,e[v]=t):e=R(),void 0===n?e:N(e,n)},keys:o.getKeys=o.getKeys||C(D,L,!1)});var W=function(t,n,e){if(!(n in k)){for(var r=[],o=0;n>o;o++)r[o]="a["+o+"]";k[n]=Function("F,a","return new F("+r.join(",")+")")}return k[n](t,e)};l(l.P,"Function",{bind:function bind(t){var n=d(this),e=M.call(arguments,1),r=function(){var o=e.concat(M.call(arguments));return this instanceof r?W(n,o.length,o):h(n,o,t)};return g(n.prototype)&&(r.prototype=n.prototype),r}});var z=O(function(){c&&M.call(c)});l(l.P+l.F*z,"Array",{slice:function(t,n){var e=w(this.length),r=f(this);if(n=void 0===n?e:n,"Array"==r)return M.call(this,t,n);for(var o=b(t,e),i=b(n,e),u=w(i-o),c=Array(u),a=0;u>a;a++)c[a]="String"==r?this.charAt(o+a):this[o+a];return c}}),l(l.P+l.F*(E!=Object),"Array",{join:function(){return F.apply(E(this),arguments)}}),l(l.S,"Array",{isArray:t(37)});var K=function(t){return function(n,e){d(n);var r=E(this),o=w(r.length),i=t?o-1:0,u=t?-1:1;if(arguments.length<2)for(;;){if(i in r){e=r[i],i+=u;break}if(i+=u,t?0>i:i>=o)throw TypeError("Reduce of empty array with no initial value")}for(;t?i>=0:o>i;i+=u)i in r&&(e=n(e,r[i],i,this));return e}},U=function(t){return function(n){return t(this,n,arguments[1])}};l(l.P,"Array",{forEach:o.each=o.each||U(p(0)),map:U(p(1)),filter:U(p(2)),some:U(p(3)),every:U(p(4)),reduce:K(!1),reduceRight:K(!0),indexOf:U(I),lastIndexOf:function(t,n){var e=x(this),r=w(e.length),o=r-1;for(arguments.length>1&&(o=Math.min(o,S(n))),0>o&&(o=w(r+o));o>=0;o--)if(o in e&&e[o]===t)return o;return-1}}),l(l.S,"Date",{now:function(){return+new Date}});var q=function(t){return t>9?t:"0"+t},J=new Date(-5e13-1),B=!(J.toISOString&&"0385-07-25T07:06:39.999Z"==J.toISOString()&&O(function(){new Date(NaN).toISOString()}));l(l.P+l.F*B,"Date",{toISOString:function toISOString(){if(!isFinite(this))throw RangeError("Invalid time value");var t=this,n=t.getUTCFullYear(),e=t.getUTCMilliseconds(),r=0>n?"-":n>9999?"+":"";return r+("00000"+Math.abs(n)).slice(r?-6:-4)+"-"+q(t.getUTCMonth()+1)+"-"+q(t.getUTCDate())+"T"+q(t.getUTCHours())+":"+q(t.getUTCMinutes())+":"+q(t.getUTCSeconds())+"."+(e>99?e:"0"+q(e))+"Z"}})},{12:12,19:19,21:21,22:22,25:25,3:3,31:31,33:33,34:34,35:35,37:37,39:39,47:47,5:5,61:61,77:77,78:78,79:79,8:8,80:80,81:81,83:83,9:9}],87:[function(t,n,e){"use strict";var r=t(19);r(r.P,"Array",{copyWithin:t(6)}),t(4)("copyWithin")},{19:19,4:4,6:6}],88:[function(t,n,e){var r=t(19);r(r.P,"Array",{fill:t(7)}),t(4)("fill")},{19:19,4:4,7:7}],89:[function(t,n,e){"use strict";var r="findIndex",o=t(19),i=!0,u=t(9)(6);r in[]&&Array(1)[r](function(){i=!1}),o(o.P+o.F*i,"Array",{findIndex:function findIndex(t){return u(this,t,arguments.length>1?arguments[1]:void 0)}}),t(4)(r)},{19:19,4:4,9:9}],90:[function(t,n,e){"use strict";var r="find",o=t(19),i=!0,u=t(9)(5);r in[]&&Array(1)[r](function(){i=!1}),o(o.P+o.F*i,"Array",{find:function find(t){return u(this,t,arguments.length>1?arguments[1]:void 0)}}),t(4)(r)},{19:19,4:4,9:9}],91:[function(t,n,e){"use strict";var r=t(18),o=t(19),i=t(81),u=t(41),c=t(36),a=t(80),s=t(85);o(o.S+o.F*!t(44)(function(t){Array.from(t)}),"Array",{from:function from(t){var n,e,o,f,l=i(t),h="function"==typeof this?this:Array,p=arguments,v=p.length,g=v>1?p[1]:void 0,y=void 0!==g,d=0,m=s(l);if(y&&(g=r(g,v>2?p[2]:void 0,2)),void 0==m||h==Array&&c(m))for(n=a(l.length),e=new h(n);n>d;d++)e[d]=y?g(l[d],d):l[d];else for(f=m.call(l),e=new h;!(o=f.next()).done;d++)e[d]=y?u(f,g,[o.value,d],!0):o.value;return e.length=d,e}})},{18:18,19:19,36:36,41:41,44:44,80:80,81:81,85:85}],92:[function(t,n,e){"use strict";var r=t(4),o=t(45),i=t(46),u=t(79);n.exports=t(43)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,o(1)):"keys"==n?o(0,e):"values"==n?o(0,t[e]):o(0,[e,t[e]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},{4:4,43:43,45:45,46:46,79:79}],93:[function(t,n,e){"use strict";var r=t(19);r(r.S+r.F*t(25)(function(){function F(){}return!(Array.of.call(F)instanceof F)}),"Array",{of:function of(){for(var t=0,n=arguments,e=n.length,r=new("function"==typeof this?this:Array)(e);e>t;)r[t]=n[t++];return r.length=e,r}})},{19:19,25:25}],94:[function(t,n,e){t(66)("Array")},{66:66}],95:[function(t,n,e){"use strict";var r=t(47),o=t(39),i=t(84)("hasInstance"),u=Function.prototype;i in u||r.setDesc(u,i,{value:function(t){if("function"!=typeof this||!o(t))return!1;if(!o(this.prototype))return t instanceof this;for(;t=r.getProto(t);)if(this.prototype===t)return!0;return!1}})},{39:39,47:47,84:84}],96:[function(t,n,e){var r=t(47).setDesc,o=t(61),i=t(31),u=Function.prototype,c=/^\s*function ([^ (]*)/,a="name";a in u||t(21)&&r(u,a,{configurable:!0,get:function(){var t=(""+this).match(c),n=t?t[1]:"";return i(this,a)||r(this,a,o(5,n)),n}})},{21:21,31:31,47:47,61:61}],97:[function(t,n,e){"use strict";var r=t(13);t(16)("Map",function(t){return function Map(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function get(t){var n=r.getEntry(this,t);return n&&n.v},set:function set(t,n){return r.def(this,0===t?0:t,n)}},r,!0)},{13:13,16:16}],98:[function(t,n,e){var r=t(19),o=t(51),i=Math.sqrt,u=Math.acosh;r(r.S+r.F*!(u&&710==Math.floor(u(Number.MAX_VALUE))),"Math",{acosh:function acosh(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:o(t-1+i(t-1)*i(t+1))}})},{19:19,51:51}],99:[function(t,n,e){function asinh(t){return isFinite(t=+t)&&0!=t?0>t?-asinh(-t):Math.log(t+Math.sqrt(t*t+1)):t}var r=t(19);r(r.S,"Math",{asinh:asinh})},{19:19}],100:[function(t,n,e){var r=t(19);r(r.S,"Math",{atanh:function atanh(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},{19:19}],101:[function(t,n,e){var r=t(19),o=t(52);r(r.S,"Math",{cbrt:function cbrt(t){return o(t=+t)*Math.pow(Math.abs(t),1/3)}})},{19:19,52:52}],102:[function(t,n,e){var r=t(19);r(r.S,"Math",{clz32:function clz32(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},{19:19}],103:[function(t,n,e){var r=t(19),o=Math.exp;r(r.S,"Math",{cosh:function cosh(t){return(o(t=+t)+o(-t))/2}})},{19:19}],104:[function(t,n,e){var r=t(19);r(r.S,"Math",{expm1:t(50)})},{19:19,50:50}],105:[function(t,n,e){var r=t(19),o=t(52),i=Math.pow,u=i(2,-52),c=i(2,-23),a=i(2,127)*(2-c),s=i(2,-126),f=function(t){return t+1/u-1/u};r(r.S,"Math",{fround:function fround(t){var n,e,r=Math.abs(t),i=o(t);return s>r?i*f(r/s/c)*s*c:(n=(1+c/u)*r,e=n-(n-r),e>a||e!=e?i*(1/0):i*e)}})},{19:19,52:52}],106:[function(t,n,e){var r=t(19),o=Math.abs;r(r.S,"Math",{hypot:function hypot(t,n){for(var e,r,i=0,u=0,c=arguments,a=c.length,s=0;a>u;)e=o(c[u++]),e>s?(r=s/e,i=i*r*r+1,s=e):e>0?(r=e/s,i+=r*r):i+=e;return s===1/0?1/0:s*Math.sqrt(i)}})},{19:19}],107:[function(t,n,e){var r=t(19),o=Math.imul;r(r.S+r.F*t(25)(function(){return-5!=o(4294967295,5)||2!=o.length}),"Math",{imul:function imul(t,n){var e=65535,r=+t,o=+n,i=e&r,u=e&o;return 0|i*u+((e&r>>>16)*u+i*(e&o>>>16)<<16>>>0)}})},{19:19,25:25}],108:[function(t,n,e){var r=t(19);r(r.S,"Math",{log10:function log10(t){return Math.log(t)/Math.LN10}})},{19:19}],109:[function(t,n,e){var r=t(19);r(r.S,"Math",{log1p:t(51)})},{19:19,51:51}],110:[function(t,n,e){var r=t(19);r(r.S,"Math",{log2:function log2(t){return Math.log(t)/Math.LN2}})},{19:19}],111:[function(t,n,e){var r=t(19);r(r.S,"Math",{sign:t(52)})},{19:19,52:52}],112:[function(t,n,e){var r=t(19),o=t(50),i=Math.exp;r(r.S+r.F*t(25)(function(){return-2e-17!=!Math.sinh(-2e-17)}),"Math",{sinh:function sinh(t){return Math.abs(t=+t)<1?(o(t)-o(-t))/2:(i(t-1)-i(-t-1))*(Math.E/2)}})},{19:19,25:25,50:50}],113:[function(t,n,e){var r=t(19),o=t(50),i=Math.exp;r(r.S,"Math",{tanh:function tanh(t){var n=o(t=+t),e=o(-t);return n==1/0?1:e==1/0?-1:(n-e)/(i(t)+i(-t));
  }})},{19:19,50:50}],114:[function(t,n,e){var r=t(19);r(r.S,"Math",{trunc:function trunc(t){return(t>0?Math.floor:Math.ceil)(t)}})},{19:19}],115:[function(t,n,e){"use strict";var r=t(47),o=t(30),i=t(31),u=t(12),c=t(82),a=t(25),s=t(75).trim,f="Number",l=o[f],h=l,p=l.prototype,v=u(r.create(p))==f,g="trim"in String.prototype,y=function(t){var n=c(t,!1);if("string"==typeof n&&n.length>2){n=g?n.trim():s(n,3);var e,r,o,i=n.charCodeAt(0);if(43===i||45===i){if(e=n.charCodeAt(2),88===e||120===e)return NaN}else if(48===i){switch(n.charCodeAt(1)){case 66:case 98:r=2,o=49;break;case 79:case 111:r=8,o=55;break;default:return+n}for(var u,a=n.slice(2),f=0,l=a.length;l>f;f++)if(u=a.charCodeAt(f),48>u||u>o)return NaN;return parseInt(a,r)}}return+n};l(" 0o1")&&l("0b1")&&!l("+0x1")||(l=function Number(t){var n=arguments.length<1?0:t,e=this;return e instanceof l&&(v?a(function(){p.valueOf.call(e)}):u(e)!=f)?new h(y(n)):y(n)},r.each.call(t(21)?r.getNames(h):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),function(t){i(h,t)&&!i(l,t)&&r.setDesc(l,t,r.getDesc(h,t))}),l.prototype=p,p.constructor=l,t(62)(o,f,l))},{12:12,21:21,25:25,30:30,31:31,47:47,62:62,75:75,82:82}],116:[function(t,n,e){var r=t(19);r(r.S,"Number",{EPSILON:Math.pow(2,-52)})},{19:19}],117:[function(t,n,e){var r=t(19),o=t(30).isFinite;r(r.S,"Number",{isFinite:function isFinite(t){return"number"==typeof t&&o(t)}})},{19:19,30:30}],118:[function(t,n,e){var r=t(19);r(r.S,"Number",{isInteger:t(38)})},{19:19,38:38}],119:[function(t,n,e){var r=t(19);r(r.S,"Number",{isNaN:function isNaN(t){return t!=t}})},{19:19}],120:[function(t,n,e){var r=t(19),o=t(38),i=Math.abs;r(r.S,"Number",{isSafeInteger:function isSafeInteger(t){return o(t)&&i(t)<=9007199254740991}})},{19:19,38:38}],121:[function(t,n,e){var r=t(19);r(r.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},{19:19}],122:[function(t,n,e){var r=t(19);r(r.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},{19:19}],123:[function(t,n,e){var r=t(19);r(r.S,"Number",{parseFloat:parseFloat})},{19:19}],124:[function(t,n,e){var r=t(19);r(r.S,"Number",{parseInt:parseInt})},{19:19}],125:[function(t,n,e){var r=t(19);r(r.S+r.F,"Object",{assign:t(55)})},{19:19,55:55}],126:[function(t,n,e){var r=t(39);t(56)("freeze",function(t){return function freeze(n){return t&&r(n)?t(n):n}})},{39:39,56:56}],127:[function(t,n,e){var r=t(79);t(56)("getOwnPropertyDescriptor",function(t){return function getOwnPropertyDescriptor(n,e){return t(r(n),e)}})},{56:56,79:79}],128:[function(t,n,e){t(56)("getOwnPropertyNames",function(){return t(29).get})},{29:29,56:56}],129:[function(t,n,e){var r=t(81);t(56)("getPrototypeOf",function(t){return function getPrototypeOf(n){return t(r(n))}})},{56:56,81:81}],130:[function(t,n,e){var r=t(39);t(56)("isExtensible",function(t){return function isExtensible(n){return r(n)?t?t(n):!0:!1}})},{39:39,56:56}],131:[function(t,n,e){var r=t(39);t(56)("isFrozen",function(t){return function isFrozen(n){return r(n)?t?t(n):!1:!0}})},{39:39,56:56}],132:[function(t,n,e){var r=t(39);t(56)("isSealed",function(t){return function isSealed(n){return r(n)?t?t(n):!1:!0}})},{39:39,56:56}],133:[function(t,n,e){var r=t(19);r(r.S,"Object",{is:t(64)})},{19:19,64:64}],134:[function(t,n,e){var r=t(81);t(56)("keys",function(t){return function keys(n){return t(r(n))}})},{56:56,81:81}],135:[function(t,n,e){var r=t(39);t(56)("preventExtensions",function(t){return function preventExtensions(n){return t&&r(n)?t(n):n}})},{39:39,56:56}],136:[function(t,n,e){var r=t(39);t(56)("seal",function(t){return function seal(n){return t&&r(n)?t(n):n}})},{39:39,56:56}],137:[function(t,n,e){var r=t(19);r(r.S,"Object",{setPrototypeOf:t(65).set})},{19:19,65:65}],138:[function(t,n,e){"use strict";var r=t(11),o={};o[t(84)("toStringTag")]="z",o+""!="[object z]"&&t(62)(Object.prototype,"toString",function toString(){return"[object "+r(this)+"]"},!0)},{11:11,62:62,84:84}],139:[function(t,n,e){"use strict";var r,o=t(47),i=t(49),u=t(30),c=t(18),a=t(11),s=t(19),f=t(39),l=t(5),h=t(3),p=t(70),v=t(28),g=t(65).set,y=t(64),d=t(84)("species"),m=t(69),x=t(83)("record"),S=t(53),b="Promise",w=u.process,E="process"==a(w),O=u[b],P=function(t){var n=new O(function(){});return t&&(n.constructor=Object),O.resolve(n)===n},_=function(){function P2(t){var n=new O(t);return g(n,P2.prototype),n}var n=!1;try{if(n=O&&O.resolve&&P(),g(P2,O),P2.prototype=o.create(O.prototype,{constructor:{value:P2}}),P2.resolve(5).then(function(){})instanceof P2||(n=!1),n&&t(21)){var e=!1;O.resolve(o.setDesc({},"then",{get:function(){e=!0}})),n=e}}catch(r){n=!1}return n}(),M=function(t){return f(t)&&(_?"Promise"==a(t):x in t)},F=function(t,n){return i&&t===O&&n===r?!0:y(t,n)},A=function(t){var n=l(t)[d];return void 0!=n?n:t},j=function(t){var n;return f(t)&&"function"==typeof(n=t.then)?n:!1},N=function(t,n){if(!t.n){t.n=!0;var e=t.c;S(function(){for(var r=t.v,o=1==t.s,i=0,c=function(n){var e,i,u=o?n.ok:n.fail;try{u?(o||(t.h=!0),e=u===!0?r:u(r),e===n.P?n.rej(TypeError("Promise-chain cycle")):(i=j(e))?i.call(e,n.res,n.rej):n.res(e)):n.rej(r)}catch(c){n.rej(c)}};e.length>i;)c(e[i++]);e.length=0,t.n=!1,n&&setTimeout(function(){var n,e,o=t.p;I(o)&&(E?w.emit("unhandledRejection",r,o):(n=u.onunhandledrejection)?n({promise:o,reason:r}):(e=u.console)&&e.error&&e.error("Unhandled promise rejection",r)),t.a=void 0},1)})}},I=function(t){var n,e=t[x],r=e.a||e.c,o=0;if(e.h)return!1;for(;r.length>o;)if(n=r[o++],n.fail||!I(n.P))return!1;return!0},k=function(t){var n=this;n.d||(n.d=!0,n=n.r||n,n.v=t,n.s=2,n.a=n.c.slice(),N(n,!0))},D=function(t){var n,e=this;if(!e.d){e.d=!0,e=e.r||e;try{(n=j(t))?S(function(){var r={r:e,d:!1};try{n.call(t,c(D,r,1),c(k,r,1))}catch(o){k.call(r,o)}}):(e.v=t,e.s=1,N(e,!1))}catch(r){k.call({r:e,d:!1},r)}}};_||(O=function Promise(t){h(t);var n={p:p(this,O,b),c:[],a:void 0,s:0,d:!1,v:void 0,h:!1,n:!1};this[x]=n;try{t(c(D,n,1),c(k,n,1))}catch(e){k.call(n,e)}},t(54)(O.prototype,{then:function then(t,n){var e={ok:"function"==typeof t?t:!0,fail:"function"==typeof n?n:!1},r=e.P=new(m(this,O))(function(t,n){e.res=t,e.rej=n});h(e.res),h(e.rej);var o=this[x];return o.c.push(e),o.a&&o.a.push(e),o.s&&N(o,!1),r},"catch":function(t){return this.then(void 0,t)}})),s(s.G+s.W+s.F*!_,{Promise:O}),t(67)(O,b),t(66)(b),r=t(17)[b],s(s.S+s.F*!_,b,{reject:function reject(t){return new this(function(n,e){e(t)})}}),s(s.S+s.F*(!_||P(!0)),b,{resolve:function resolve(t){return M(t)&&F(t.constructor,this)?t:new this(function(n){n(t)})}}),s(s.S+s.F*!(_&&t(44)(function(t){O.all(t)["catch"](function(){})})),b,{all:function all(t){var n=A(this),e=[];return new n(function(r,i){v(t,!1,e.push,e);var u=e.length,c=Array(u);u?o.each.call(e,function(t,e){n.resolve(t).then(function(t){c[e]=t,--u||r(c)},i)}):r(c)})},race:function race(t){var n=A(this);return new n(function(e,r){v(t,!1,function(t){n.resolve(t).then(e,r)})})}})},{11:11,17:17,18:18,19:19,21:21,28:28,3:3,30:30,39:39,44:44,47:47,49:49,5:5,53:53,54:54,64:64,65:65,66:66,67:67,69:69,70:70,83:83,84:84}],140:[function(t,n,e){var r=t(19),o=Function.apply;r(r.S,"Reflect",{apply:function apply(t,n,e){return o.call(t,n,e)}})},{19:19}],141:[function(t,n,e){var r=t(47),o=t(19),i=t(3),u=t(5),c=t(39),a=Function.bind||t(17).Function.prototype.bind;o(o.S+o.F*t(25)(function(){function F(){}return!(Reflect.construct(function(){},[],F)instanceof F)}),"Reflect",{construct:function construct(t,n){i(t);var e=arguments.length<3?t:i(arguments[2]);if(t==e){if(void 0!=n)switch(u(n).length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3])}var o=[null];return o.push.apply(o,n),new(a.apply(t,o))}var s=e.prototype,f=r.create(c(s)?s:Object.prototype),l=Function.apply.call(t,f,n);return c(l)?l:f}})},{17:17,19:19,25:25,3:3,39:39,47:47,5:5}],142:[function(t,n,e){var r=t(47),o=t(19),i=t(5);o(o.S+o.F*t(25)(function(){Reflect.defineProperty(r.setDesc({},1,{value:1}),1,{value:2})}),"Reflect",{defineProperty:function defineProperty(t,n,e){i(t);try{return r.setDesc(t,n,e),!0}catch(o){return!1}}})},{19:19,25:25,47:47,5:5}],143:[function(t,n,e){var r=t(19),o=t(47).getDesc,i=t(5);r(r.S,"Reflect",{deleteProperty:function deleteProperty(t,n){var e=o(i(t),n);return e&&!e.configurable?!1:delete t[n]}})},{19:19,47:47,5:5}],144:[function(t,n,e){"use strict";var r=t(19),o=t(5),i=function(t){this._t=o(t),this._i=0;var n,e=this._k=[];for(n in t)e.push(n)};t(42)(i,"Object",function(){var t,n=this,e=n._k;do if(n._i>=e.length)return{value:void 0,done:!0};while(!((t=e[n._i++])in n._t));return{value:t,done:!1}}),r(r.S,"Reflect",{enumerate:function enumerate(t){return new i(t)}})},{19:19,42:42,5:5}],145:[function(t,n,e){var r=t(47),o=t(19),i=t(5);o(o.S,"Reflect",{getOwnPropertyDescriptor:function getOwnPropertyDescriptor(t,n){return r.getDesc(i(t),n)}})},{19:19,47:47,5:5}],146:[function(t,n,e){var r=t(19),o=t(47).getProto,i=t(5);r(r.S,"Reflect",{getPrototypeOf:function getPrototypeOf(t){return o(i(t))}})},{19:19,47:47,5:5}],147:[function(t,n,e){function get(t,n){var e,i,a=arguments.length<3?t:arguments[2];return c(t)===a?t[n]:(e=r.getDesc(t,n))?o(e,"value")?e.value:void 0!==e.get?e.get.call(a):void 0:u(i=r.getProto(t))?get(i,n,a):void 0}var r=t(47),o=t(31),i=t(19),u=t(39),c=t(5);i(i.S,"Reflect",{get:get})},{19:19,31:31,39:39,47:47,5:5}],148:[function(t,n,e){var r=t(19);r(r.S,"Reflect",{has:function has(t,n){return n in t}})},{19:19}],149:[function(t,n,e){var r=t(19),o=t(5),i=Object.isExtensible;r(r.S,"Reflect",{isExtensible:function isExtensible(t){return o(t),i?i(t):!0}})},{19:19,5:5}],150:[function(t,n,e){var r=t(19);r(r.S,"Reflect",{ownKeys:t(58)})},{19:19,58:58}],151:[function(t,n,e){var r=t(19),o=t(5),i=Object.preventExtensions;r(r.S,"Reflect",{preventExtensions:function preventExtensions(t){o(t);try{return i&&i(t),!0}catch(n){return!1}}})},{19:19,5:5}],152:[function(t,n,e){var r=t(19),o=t(65);o&&r(r.S,"Reflect",{setPrototypeOf:function setPrototypeOf(t,n){o.check(t,n);try{return o.set(t,n),!0}catch(e){return!1}}})},{19:19,65:65}],153:[function(t,n,e){function set(t,n,e){var i,s,f=arguments.length<4?t:arguments[3],l=r.getDesc(c(t),n);if(!l){if(a(s=r.getProto(t)))return set(s,n,e,f);l=u(0)}return o(l,"value")?l.writable!==!1&&a(f)?(i=r.getDesc(f,n)||u(0),i.value=e,r.setDesc(f,n,i),!0):!1:void 0===l.set?!1:(l.set.call(f,e),!0)}var r=t(47),o=t(31),i=t(19),u=t(61),c=t(5),a=t(39);i(i.S,"Reflect",{set:set})},{19:19,31:31,39:39,47:47,5:5,61:61}],154:[function(t,n,e){var r=t(47),o=t(30),i=t(40),u=t(27),c=o.RegExp,a=c,s=c.prototype,f=/a/g,l=/a/g,h=new c(f)!==f;!t(21)||h&&!t(25)(function(){return l[t(84)("match")]=!1,c(f)!=f||c(l)==l||"/a/i"!=c(f,"i")})||(c=function RegExp(t,n){var e=i(t),r=void 0===n;return this instanceof c||!e||t.constructor!==c||!r?h?new a(e&&!r?t.source:t,n):a((e=t instanceof c)?t.source:t,e&&r?u.call(t):n):t},r.each.call(r.getNames(a),function(t){t in c||r.setDesc(c,t,{configurable:!0,get:function(){return a[t]},set:function(n){a[t]=n}})}),s.constructor=c,c.prototype=s,t(62)(o,"RegExp",c)),t(66)("RegExp")},{21:21,25:25,27:27,30:30,40:40,47:47,62:62,66:66,84:84}],155:[function(t,n,e){var r=t(47);t(21)&&"g"!=/./g.flags&&r.setDesc(RegExp.prototype,"flags",{configurable:!0,get:t(27)})},{21:21,27:27,47:47}],156:[function(t,n,e){t(26)("match",1,function(t,n){return function match(e){"use strict";var r=t(this),o=void 0==e?void 0:e[n];return void 0!==o?o.call(e,r):new RegExp(e)[n](String(r))}})},{26:26}],157:[function(t,n,e){t(26)("replace",2,function(t,n,e){return function replace(r,o){"use strict";var i=t(this),u=void 0==r?void 0:r[n];return void 0!==u?u.call(r,i,o):e.call(String(i),r,o)}})},{26:26}],158:[function(t,n,e){t(26)("search",1,function(t,n){return function search(e){"use strict";var r=t(this),o=void 0==e?void 0:e[n];return void 0!==o?o.call(e,r):new RegExp(e)[n](String(r))}})},{26:26}],159:[function(t,n,e){t(26)("split",2,function(t,n,e){return function split(r,o){"use strict";var i=t(this),u=void 0==r?void 0:r[n];return void 0!==u?u.call(r,i,o):e.call(String(i),r,o)}})},{26:26}],160:[function(t,n,e){"use strict";var r=t(13);t(16)("Set",function(t){return function Set(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function add(t){return r.def(this,t=0===t?0:t,t)}},r)},{13:13,16:16}],161:[function(t,n,e){"use strict";var r=t(19),o=t(71)(!1);r(r.P,"String",{codePointAt:function codePointAt(t){return o(this,t)}})},{19:19,71:71}],162:[function(t,n,e){"use strict";var r=t(19),o=t(80),i=t(72),u="endsWith",c=""[u];r(r.P+r.F*t(24)(u),"String",{endsWith:function endsWith(t){var n=i(this,t,u),e=arguments,r=e.length>1?e[1]:void 0,a=o(n.length),s=void 0===r?a:Math.min(o(r),a),f=String(t);return c?c.call(n,f,s):n.slice(s-f.length,s)===f}})},{19:19,24:24,72:72,80:80}],163:[function(t,n,e){var r=t(19),o=t(77),i=String.fromCharCode,u=String.fromCodePoint;r(r.S+r.F*(!!u&&1!=u.length),"String",{fromCodePoint:function fromCodePoint(t){for(var n,e=[],r=arguments,u=r.length,c=0;u>c;){if(n=+r[c++],o(n,1114111)!==n)throw RangeError(n+" is not a valid code point");e.push(65536>n?i(n):i(((n-=65536)>>10)+55296,n%1024+56320))}return e.join("")}})},{19:19,77:77}],164:[function(t,n,e){"use strict";var r=t(19),o=t(72),i="includes";r(r.P+r.F*t(24)(i),"String",{includes:function includes(t){return!!~o(this,t,i).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},{19:19,24:24,72:72}],165:[function(t,n,e){"use strict";var r=t(71)(!0);t(43)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})})},{43:43,71:71}],166:[function(t,n,e){var r=t(19),o=t(79),i=t(80);r(r.S,"String",{raw:function raw(t){for(var n=o(t.raw),e=i(n.length),r=arguments,u=r.length,c=[],a=0;e>a;)c.push(String(n[a++])),u>a&&c.push(String(r[a]));return c.join("")}})},{19:19,79:79,80:80}],167:[function(t,n,e){var r=t(19);r(r.P,"String",{repeat:t(74)})},{19:19,74:74}],168:[function(t,n,e){"use strict";var r=t(19),o=t(80),i=t(72),u="startsWith",c=""[u];r(r.P+r.F*t(24)(u),"String",{startsWith:function startsWith(t){var n=i(this,t,u),e=arguments,r=o(Math.min(e.length>1?e[1]:void 0,n.length)),a=String(t);return c?c.call(n,a,r):n.slice(r,r+a.length)===a}})},{19:19,24:24,72:72,80:80}],169:[function(t,n,e){"use strict";t(75)("trim",function(t){return function trim(){return t(this,3)}})},{75:75}],170:[function(t,n,e){"use strict";var r=t(47),o=t(30),i=t(31),u=t(21),c=t(19),a=t(62),s=t(25),f=t(68),l=t(67),h=t(83),p=t(84),v=t(48),g=t(29),y=t(23),d=t(37),m=t(5),x=t(79),S=t(61),b=r.getDesc,w=r.setDesc,E=r.create,O=g.get,P=o.Symbol,_=o.JSON,M=_&&_.stringify,F=!1,A=p("_hidden"),j=r.isEnum,N=f("symbol-registry"),I=f("symbols"),k="function"==typeof P,D=Object.prototype,T=u&&s(function(){return 7!=E(w({},"a",{get:function(){return w(this,"a",{value:7}).a}})).a})?function(t,n,e){var r=b(D,n);r&&delete D[n],w(t,n,e),r&&t!==D&&w(D,n,r)}:w,L=function(t){var n=I[t]=E(P.prototype);return n._k=t,u&&F&&T(D,t,{configurable:!0,set:function(n){i(this,A)&&i(this[A],t)&&(this[A][t]=!1),T(this,t,S(1,n))}}),n},R=function(t){return"symbol"==typeof t},C=function defineProperty(t,n,e){return e&&i(I,n)?(e.enumerable?(i(t,A)&&t[A][n]&&(t[A][n]=!1),e=E(e,{enumerable:S(0,!1)})):(i(t,A)||w(t,A,S(1,{})),t[A][n]=!0),T(t,n,e)):w(t,n,e)},G=function defineProperties(t,n){m(t);for(var e,r=y(n=x(n)),o=0,i=r.length;i>o;)C(t,e=r[o++],n[e]);return t},W=function create(t,n){return void 0===n?E(t):G(E(t),n)},z=function propertyIsEnumerable(t){var n=j.call(this,t);return n||!i(this,t)||!i(I,t)||i(this,A)&&this[A][t]?n:!0},K=function getOwnPropertyDescriptor(t,n){var e=b(t=x(t),n);return!e||!i(I,n)||i(t,A)&&t[A][n]||(e.enumerable=!0),e},U=function getOwnPropertyNames(t){for(var n,e=O(x(t)),r=[],o=0;e.length>o;)i(I,n=e[o++])||n==A||r.push(n);return r},q=function getOwnPropertySymbols(t){for(var n,e=O(x(t)),r=[],o=0;e.length>o;)i(I,n=e[o++])&&r.push(I[n]);return r},J=function stringify(t){if(void 0!==t&&!R(t)){for(var n,e,r=[t],o=1,i=arguments;i.length>o;)r.push(i[o++]);return n=r[1],"function"==typeof n&&(e=n),(e||!d(n))&&(n=function(t,n){return e&&(n=e.call(this,t,n)),R(n)?void 0:n}),r[1]=n,M.apply(_,r)}},B=s(function(){var t=P();return"[null]"!=M([t])||"{}"!=M({a:t})||"{}"!=M(Object(t))});k||(P=function Symbol(){if(R(this))throw TypeError("Symbol is not a constructor");return L(h(arguments.length>0?arguments[0]:void 0))},a(P.prototype,"toString",function toString(){return this._k}),R=function(t){return t instanceof P},r.create=W,r.isEnum=z,r.getDesc=K,r.setDesc=C,r.setDescs=G,r.getNames=g.get=U,r.getSymbols=q,u&&!t(49)&&a(D,"propertyIsEnumerable",z,!0));var V={"for":function(t){return i(N,t+="")?N[t]:N[t]=P(t)},keyFor:function keyFor(t){return v(N,t)},useSetter:function(){F=!0},useSimple:function(){F=!1}};r.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),function(t){var n=p(t);V[t]=k?n:L(n)}),F=!0,c(c.G+c.W,{Symbol:P}),c(c.S,"Symbol",V),c(c.S+c.F*!k,"Object",{create:W,defineProperty:C,defineProperties:G,getOwnPropertyDescriptor:K,getOwnPropertyNames:U,getOwnPropertySymbols:q}),_&&c(c.S+c.F*(!k||B),"JSON",{stringify:J}),l(P,"Symbol"),l(Math,"Math",!0),l(o.JSON,"JSON",!0)},{19:19,21:21,23:23,25:25,29:29,30:30,31:31,37:37,47:47,48:48,49:49,5:5,61:61,62:62,67:67,68:68,79:79,83:83,84:84}],171:[function(t,n,e){"use strict";var r=t(47),o=t(62),i=t(15),u=t(39),c=t(31),a=i.frozenStore,s=i.WEAK,f=Object.isExtensible||u,l={},h=t(16)("WeakMap",function(t){return function WeakMap(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function get(t){if(u(t)){if(!f(t))return a(this).get(t);if(c(t,s))return t[s][this._i]}},set:function set(t,n){return i.def(this,t,n)}},i,!0,!0);7!=(new h).set((Object.freeze||Object)(l),7).get(l)&&r.each.call(["delete","has","get","set"],function(t){var n=h.prototype,e=n[t];o(n,t,function(n,r){if(u(n)&&!f(n)){var o=a(this)[t](n,r);return"set"==t?this:o}return e.call(this,n,r)})})},{15:15,16:16,31:31,39:39,47:47,62:62}],172:[function(t,n,e){"use strict";var r=t(15);t(16)("WeakSet",function(t){return function WeakSet(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function add(t){return r.def(this,t,!0)}},r,!1,!0)},{15:15,16:16}],173:[function(t,n,e){"use strict";var r=t(19),o=t(8)(!0);r(r.P,"Array",{includes:function includes(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),t(4)("includes")},{19:19,4:4,8:8}],174:[function(t,n,e){var r=t(19);r(r.P,"Map",{toJSON:t(14)("Map")})},{14:14,19:19}],175:[function(t,n,e){var r=t(19),o=t(57)(!0);r(r.S,"Object",{entries:function entries(t){return o(t)}})},{19:19,57:57}],176:[function(t,n,e){var r=t(47),o=t(19),i=t(58),u=t(79),c=t(61);o(o.S,"Object",{getOwnPropertyDescriptors:function getOwnPropertyDescriptors(t){for(var n,e,o=u(t),a=r.setDesc,s=r.getDesc,f=i(o),l={},h=0;f.length>h;)e=s(o,n=f[h++]),n in l?a(l,n,c(0,e)):l[n]=e;return l}})},{19:19,47:47,58:58,61:61,79:79}],177:[function(t,n,e){var r=t(19),o=t(57)(!1);r(r.S,"Object",{values:function values(t){return o(t)}})},{19:19,57:57}],178:[function(t,n,e){var r=t(19),o=t(63)(/[\\^$*+?.()|[\]{}]/g,"\\$&");r(r.S,"RegExp",{escape:function escape(t){return o(t)}})},{19:19,63:63}],179:[function(t,n,e){var r=t(19);r(r.P,"Set",{toJSON:t(14)("Set")})},{14:14,19:19}],180:[function(t,n,e){"use strict";var r=t(19),o=t(71)(!0);r(r.P,"String",{at:function at(t){return o(this,t)}})},{19:19,71:71}],181:[function(t,n,e){"use strict";var r=t(19),o=t(73);r(r.P,"String",{padLeft:function padLeft(t){return o(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},{19:19,73:73}],182:[function(t,n,e){"use strict";var r=t(19),o=t(73);r(r.P,"String",{padRight:function padRight(t){return o(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},{19:19,73:73}],183:[function(t,n,e){"use strict";t(75)("trimLeft",function(t){return function trimLeft(){return t(this,1)}})},{75:75}],184:[function(t,n,e){"use strict";t(75)("trimRight",function(t){return function trimRight(){return t(this,2)}})},{75:75}],185:[function(t,n,e){var r=t(47),o=t(19),i=t(18),u=t(17).Array||Array,c={},a=function(t,n){r.each.call(t.split(","),function(t){void 0==n&&t in u?c[t]=u[t]:t in[]&&(c[t]=i(Function.call,[][t],n))})};a("pop,reverse,shift,keys,values,entries",1),a("indexOf,every,some,forEach,map,filter,find,findIndex,includes",3),a("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill"),o(o.S,"Array",c)},{17:17,18:18,19:19,47:47}],186:[function(t,n,e){t(92);var r=t(30),o=t(32),i=t(46),u=t(84)("iterator"),c=r.NodeList,a=r.HTMLCollection,s=c&&c.prototype,f=a&&a.prototype,l=i.NodeList=i.HTMLCollection=i.Array;!c||u in s||o(s,u,l),!a||u in f||o(f,u,l)},{30:30,32:32,46:46,84:84,92:92}],187:[function(t,n,e){var r=t(19),o=t(76);r(r.G+r.B,{setImmediate:o.set,clearImmediate:o.clear})},{19:19,76:76}],188:[function(t,n,e){var r=t(30),o=t(19),i=t(34),u=t(59),c=r.navigator,a=!!c&&/MSIE .\./.test(c.userAgent),s=function(t){return a?function(n,e){return t(i(u,[].slice.call(arguments,2),"function"==typeof n?n:Function(n)),e)}:t};o(o.G+o.B+o.F*a,{setTimeout:s(r.setTimeout),setInterval:s(r.setInterval)})},{19:19,30:30,34:34,59:59}],189:[function(t,n,e){t(86),t(170),t(125),t(133),t(137),t(138),t(126),t(136),t(135),t(131),t(132),t(130),t(127),t(129),t(134),t(128),t(96),t(95),t(115),t(116),t(117),t(118),t(119),t(120),t(121),t(122),t(123),t(124),t(98),t(99),t(100),t(101),t(102),t(103),t(104),t(105),t(106),t(107),t(108),t(109),t(110),t(111),t(112),t(113),t(114),t(163),t(166),t(169),t(165),t(161),t(162),t(164),t(167),t(168),t(91),t(93),t(92),t(94),t(87),t(88),t(90),t(89),t(154),t(155),t(156),t(157),t(158),t(159),t(139),t(97),t(160),t(171),t(172),t(140),t(141),t(142),t(143),t(144),t(147),t(145),t(146),t(148),t(149),t(150),t(151),t(153),t(152),t(173),t(180),t(181),t(182),t(183),t(184),t(178),t(176),t(177),t(175),t(174),t(179),t(185),t(188),t(187),t(186),n.exports=t(17)},{100:100,101:101,102:102,103:103,104:104,105:105,106:106,107:107,108:108,109:109,110:110,111:111,112:112,113:113,114:114,115:115,116:116,117:117,118:118,119:119,120:120,121:121,122:122,123:123,124:124,125:125,126:126,127:127,128:128,129:129,130:130,131:131,132:132,133:133,134:134,135:135,136:136,137:137,138:138,139:139,140:140,141:141,142:142,143:143,144:144,145:145,146:146,147:147,148:148,149:149,150:150,151:151,152:152,153:153,154:154,155:155,156:156,157:157,158:158,159:159,160:160,161:161,162:162,163:163,164:164,165:165,166:166,167:167,168:168,169:169,17:17,170:170,171:171,172:172,173:173,174:174,175:175,176:176,177:177,178:178,179:179,180:180,181:181,182:182,183:183,184:184,185:185,186:186,187:187,188:188,86:86,87:87,88:88,89:89,90:90,91:91,92:92,93:93,94:94,95:95,96:96,97:97,98:98,99:99}],190:[function(t,n,e){(function(t){!function(t){"use strict";function wrap(t,n,e,r){var o=Object.create((n||Generator).prototype),i=new Context(r||[]);return o._invoke=makeInvokeMethod(t,e,i),o}function tryCatch(t,n,e){try{return{type:"normal",arg:t.call(n,e)}}catch(r){return{type:"throw",arg:r}}}function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}function defineIteratorMethods(t){["next","throw","return"].forEach(function(n){t[n]=function(t){return this._invoke(n,t)}})}function AwaitArgument(t){this.arg=t}function AsyncIterator(t){function invoke(n,o){var i=t[n](o),u=i.value;return u instanceof AwaitArgument?Promise.resolve(u.arg).then(e,r):Promise.resolve(u).then(function(t){return i.value=t,i})}function enqueue(t,e){function callInvokeWithMethodAndArg(){return invoke(t,e)}return n=n?n.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):new Promise(function(t){t(callInvokeWithMethodAndArg())})}"object"==typeof process&&process.domain&&(invoke=process.domain.bind(invoke));var n,e=invoke.bind(t,"next"),r=invoke.bind(t,"throw");invoke.bind(t,"return");this._invoke=enqueue}function makeInvokeMethod(t,n,r){var o=c;return function invoke(i,u){if(o===s)throw new Error("Generator is already running");if(o===f){if("throw"===i)throw u;return doneResult()}for(;;){var h=r.delegate;if(h){if("return"===i||"throw"===i&&h.iterator[i]===e){r.delegate=null;var p=h.iterator["return"];if(p){var v=tryCatch(p,h.iterator,u);if("throw"===v.type){i="throw",u=v.arg;continue}}if("return"===i)continue}var v=tryCatch(h.iterator[i],h.iterator,u);if("throw"===v.type){r.delegate=null,i="throw",u=v.arg;continue}i="next",u=e;var g=v.arg;if(!g.done)return o=a,g;r[h.resultName]=g.value,r.next=h.nextLoc,r.delegate=null}if("next"===i)r._sent=u,o===a?r.sent=u:r.sent=e;else if("throw"===i){if(o===c)throw o=f,u;r.dispatchException(u)&&(i="next",u=e)}else"return"===i&&r.abrupt("return",u);o=s;var v=tryCatch(t,n,r);if("normal"===v.type){o=r.done?f:a;var g={value:v.arg,done:r.done};if(v.arg!==l)return g;r.delegate&&"next"===i&&(u=e)}else"throw"===v.type&&(o=f,i="throw",u=v.arg)}}}function pushTryEntry(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function resetTryEntry(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function Context(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(pushTryEntry,this),this.reset(!0)}function values(t){if(t){var n=t[o];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,u=function next(){for(;++i<t.length;)if(r.call(t,i))return next.value=t[i],next.done=!1,next;return next.value=e,next.done=!0,next};return u.next=u}}return{next:doneResult}}function doneResult(){return{value:e,done:!0}}var e,r=Object.prototype.hasOwnProperty,o="function"==typeof Symbol&&Symbol.iterator||"@@iterator",i="object"==typeof n,u=t.regeneratorRuntime;if(u)return void(i&&(n.exports=u));u=t.regeneratorRuntime=i?n.exports:{},u.wrap=wrap;var c="suspendedStart",a="suspendedYield",s="executing",f="completed",l={},h=GeneratorFunctionPrototype.prototype=Generator.prototype;GeneratorFunction.prototype=h.constructor=GeneratorFunctionPrototype,GeneratorFunctionPrototype.constructor=GeneratorFunction,GeneratorFunction.displayName="GeneratorFunction",u.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return n?n===GeneratorFunction||"GeneratorFunction"===(n.displayName||n.name):!1},u.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,GeneratorFunctionPrototype):t.__proto__=GeneratorFunctionPrototype,t.prototype=Object.create(h),t},u.awrap=function(t){return new AwaitArgument(t)},defineIteratorMethods(AsyncIterator.prototype),u.async=function(t,n,e,r){var o=new AsyncIterator(wrap(t,n,e,r));return u.isGeneratorFunction(n)?o:o.next().then(function(t){return t.done?t.value:o.next()})},defineIteratorMethods(h),h[o]=function(){return this},h.toString=function(){return"[object Generator]"},u.keys=function(t){var n=[];for(var e in t)n.push(e);return n.reverse(),function next(){for(;n.length;){var e=n.pop();if(e in t)return next.value=e,next.done=!1,next}return next.done=!0,next}},u.values=values,Context.prototype={constructor:Context,reset:function(t){if(this.prev=0,this.next=0,this.sent=e,this.done=!1,this.delegate=null,this.tryEntries.forEach(resetTryEntry),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0],n=t.completion;if("throw"===n.type)throw n.arg;return this.rval},dispatchException:function(t){function handle(e,r){return i.type="throw",i.arg=t,n.next=e,!!r}if(this.done)throw t;for(var n=this,e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e],i=o.completion;if("root"===o.tryLoc)return handle("end");if(o.tryLoc<=this.prev){var u=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(u&&c){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0);if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}else if(u){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}}}},abrupt:function(t,n){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=n&&n<=i.finallyLoc&&(i=null);var u=i?i.completion:{};return u.type=t,u.arg=n,i?this.next=i.finallyLoc:this.complete(u),l},complete:function(t,n){if("throw"===t.type)throw t.arg;"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=t.arg,this.next="end"):"normal"===t.type&&n&&(this.next=n)},finish:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),resetTryEntry(e),l}},"catch":function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.tryLoc===t){var r=e.completion;if("throw"===r.type){var o=r.arg;resetTryEntry(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,e){return this.delegate={iterator:values(t),resultName:n,nextLoc:e},l}}}("object"==typeof t?t:"object"==typeof window?window:"object"==typeof self?self:this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);

  var Jotted = (function () {
    function Jotted($editor, opts) {
      babelHelpers.classCallCheck(this, Jotted);

      if (!$editor) {
        throw new Error('Can\'t find Jotted container.');
      }

      this.options = extend(opts, {
        files: [],
        showBlank: false,
        runScripts: true,
        pane: 'result',
        debounce: 250,
        plugins: []
      });

      this.pubsoup = new PubSoup();
      // debounced trigger method
      this.trigger = debounce(this.pubsoup.publish.bind(this.pubsoup), this.options.debounce);

      this.plugins = {};

      this.$container = $editor;
      this.$container.innerHTML = container();
      addClass(this.$container, containerClass());

      // default pane
      this.paneActive = this.options.pane;
      addClass(this.$container, paneActiveClass(this.paneActive));

      this.$result = $editor.querySelector('.jotted-pane-result');
      this.$pane = {};
      this.$error = {};

      var _arr = ['html', 'css', 'js'];
      for (var _i = 0; _i < _arr.length; _i++) {
        var type = _arr[_i];
        this.$pane[type] = $editor.querySelector('.jotted-pane-' + type);
        this.markup(type, this.$pane[type]);

        this.$error[type] = this.$pane[type].querySelector('.jotted-error');
      }

      this.$resultFrame = this.$result.querySelector('iframe');

      var $frameDoc = this.$resultFrame.contentWindow.document;
      $frameDoc.open();
      $frameDoc.write(frameContent());
      $frameDoc.close();

      this.$styleInject = document.createElement('style');
      $frameDoc.head.appendChild(this.$styleInject);

      // change events
      this.$container.addEventListener('change', debounce(this.change.bind(this), this.options.debounce));
      this.$container.addEventListener('keyup', debounce(this.change.bind(this), this.options.debounce));

      // pane change
      this.$container.addEventListener('click', this.pane.bind(this));

      // init plugins
      init.call(this);

      // done change on all subscribers,
      // render the results.
      this.done('change', this.changeCallback.bind(this));

      // show all tabs, even if empty
      if (this.options.showBlank) {
        addClass(this.$container, showBlankClass());
      }
    }

    babelHelpers.createClass(Jotted, [{
      key: 'findFile',
      value: function findFile(type) {
        var file = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.options.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _file = _step.value;

            if (_file.type === type) {
              return _file;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return file;
      }
    }, {
      key: 'markup',
      value: function markup(type, $parent) {
        var _this = this;

        // create the markup for an editor
        var file = this.findFile(type);

        var $editor = document.createElement('div');
        $editor.innerHTML = editorContent(type, file.url);
        $editor.className = editorClass(type);
        var $textarea = $editor.querySelector('textarea');

        $parent.appendChild($editor);

        // if we don't have a file for the current type
        if (typeof file.url === 'undefined' && typeof file.content === 'undefined') {
          return;
        }

        // add the has-type class to the container
        addClass(this.$container, hasFileClass(type));

        // file as string
        if (typeof file.content !== 'undefined') {
          this.setValue($textarea, file.content);
        } else if (typeof file.url !== 'undefined') {
          // file as url
          fetch(file.url, function (err, res) {
            if (err) {
              // show load errors
              _this.error([err.responseText], {
                type: type,
                file: file
              });

              return;
            }

            _this.setValue($textarea, res);
          });
        }
      }
    }, {
      key: 'setValue',
      value: function setValue($textarea, val) {
        $textarea.value = val;

        // trigger change event, for initial render
        this.change({
          target: $textarea
        });
      }
    }, {
      key: 'change',
      value: function change(e) {
        if (!data(e.target, 'jotted-type')) {
          return;
        }

        this.trigger('change', {
          type: data(e.target, 'jotted-type'),
          file: data(e.target, 'jotted-file'),
          content: e.target.value
        });
      }
    }, {
      key: 'changeCallback',
      value: function changeCallback(errors, params) {
        this.error(errors, params);

        if (params.type === 'html') {
          this.$resultFrame.contentWindow.document.body.innerHTML = params.content;

          if (this.options.runScripts) {
            runScripts.call(this, params.content);
          }

          return;
        }

        if (params.type === 'css') {
          this.$styleInject.textContent = params.content;
          return;
        }

        if (params.type === 'js') {
          // catch and show js errors
          try {
            this.$resultFrame.contentWindow.eval(params.content);
          } catch (err) {
            // only show eval errors if we don't have other errors from plugins.
            // useful for preprocessor error reporting (eg. babel, coffeescript).
            if (!errors.length) {
              this.error([err.message], {
                type: 'js'
              });
            }
          }

          return;
        }
      }
    }, {
      key: 'pane',
      value: function pane(e) {
        if (!data(e.target, 'jotted-type')) {
          return;
        }

        removeClass(this.$container, paneActiveClass(this.paneActive));
        this.paneActive = data(e.target, 'jotted-type');
        addClass(this.$container, paneActiveClass(this.paneActive));

        e.preventDefault();
      }
    }, {
      key: 'on',
      value: function on() {
        this.pubsoup.subscribe.apply(this.pubsoup, arguments);
      }
    }, {
      key: 'off',
      value: function off() {
        this.pubsoup.unsubscribe.apply(this.pubsoup, arguments);
      }
    }, {
      key: 'done',
      value: function done() {
        this.pubsoup.done.apply(this.pubsoup, arguments);
      }
    }, {
      key: 'error',
      value: function error(errors, params) {
        if (!errors.length) {
          return this.clearError(params);
        }

        addClass(this.$container, errorClass(params.type));

        var markup = '';
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = errors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var err = _step2.value;

            markup += errorMessage(err);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.$error[params.type].innerHTML = markup;
      }
    }, {
      key: 'clearError',
      value: function clearError(params) {
        removeClass(this.$container, errorClass(params.type));
        this.$error[params.type].innerHTML = '';
      }
    }]);
    return Jotted;
  })();

  // register plugins

  Jotted.plugin = function () {
    return register.apply(this, arguments);
  };

  BundlePlugins(Jotted);

  return Jotted;

}));
//# sourceMappingURL=jotted.js.map