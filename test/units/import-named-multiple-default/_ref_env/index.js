"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = require("React");

var _React2 = _interopRequireDefault(_React);

var _protonNative = require("proton-native");

var _app = require("./app.js");

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const _module_hot = function () {
	if (module.hot) {
		const data = {};
		return {
			accept(file, cb) {
				if (!data[file]) data[file] = [];
				data[file].push(cb);
			},

			run() {
				const files = Object.keys(data);

				for (let f = 0; f < files.length; f++) {
					module.hot.accept(files[f], function () {
						const cbs = data[files[f]];

						for (let cb = 0; cb < cbs.length; cb++) {
							cbs[cb]();
						}
					});
				}
			}

		};
	} else {
		return {
			accept() {},

			run() {}

		};
	}
}();

const _react_proxy = require("react-proxy");

var MyApp = function () {
	if (_app2.default && _app2.default.___component) {
		var proxy = _react_proxy.createProxy(_app2.default.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			var x = require("./app.js")["default"];

			var mountedInstances = proxy.update(x.___component);

			var forceUpdate = _react_proxy.getForceUpdate(_React2.default);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _app2.default;
	}
}();

var Example = function () {
	if (_app.Example && _app.Example.___component) {
		var proxy = _react_proxy.createProxy(_app.Example.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			var x = require("./app.js")["Example"];

			var mountedInstances = proxy.update(x.___component);

			var forceUpdate = _react_proxy.getForceUpdate(_React2.default);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _app.Example;
	}
}();

var Test = function () {
	if (_app.Test && _app.Test.___component) {
		var proxy = _react_proxy.createProxy(_app.Test.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			var x = require("./app.js")["Test"];

			var mountedInstances = proxy.update(x.___component);

			var forceUpdate = _react_proxy.getForceUpdate(_React2.default);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _app.Test;
	}
}();

var HotApp = function (_Component) {
	_inherits(HotApp, _Component);

	function HotApp() {
		_classCallCheck(this, HotApp);

		return _possibleConstructorReturn(this, (HotApp.__proto__ || Object.getPrototypeOf(HotApp)).apply(this, arguments));
	}

	_createClass(HotApp, [{
		key: "render",
		value: function render() {
			return _React2.default.createElement(
				_protonNative.App,
				null,
				_React2.default.createElement(
					_protonNative.Window,
					{ title: "Notes", size: { w: 500, h: 350 }, margined: true },
					_React2.default.createElement(MyApp, null),
					_React2.default.createElement(Example, null),
					_React2.default.createElement(Test, null)
				)
			);
		}
	}]);

	return HotApp;
}(_React.Component);

_module_hot.run();