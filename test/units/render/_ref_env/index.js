"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = require("React");

var _React2 = _interopRequireDefault(_React);

var _protonNative = require("proton-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HotApp = function (_Component) {
	_inherits(HotApp, _Component);

	function HotApp() {
		_classCallCheck(this, HotApp);

		return _possibleConstructorReturn(this, (HotApp.__proto__ || Object.getPrototypeOf(HotApp)).apply(this, arguments));
	}

	_createClass(HotApp, [{
		key: "render",
		value: function render() {
			return false;
		}
	}]);

	return HotApp;
}(_React.Component);

(function () {
	var Wrapper = function (_React$Component) {
		_inherits(Wrapper, _React$Component);

		function Wrapper() {
			_classCallCheck(this, Wrapper);

			return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
		}

		_createClass(Wrapper, [{
			key: "render",
			value: function render() {
				return _React2.default.createElement(HotApp, null);
			}
		}]);

		return Wrapper;
	}(_React2.default.Component);

	if (module.hot) {
		var proxy = void 0;

		if (module.hot.data && module.hot.data.proxy) {
			var mountedInstances = module.hot.data.proxy.update(Wrapper);
			mountedInstances.forEach(function (i) {
				return i.forceUpdate();
			});
		} else {
			proxy = _react_proxy.createProxy(Wrapper);
			(0, _protonNative.render)(_React2.default.createElement(proxy.get()));
		}

		module.hot.accept();
		module.hot.dispose(function (data) {
			data.proxy = proxy || module.hot.data && module.hot.data.proxy;
		});
	} else {
		(0, _protonNative.render)(_React2.default.createElement(HotApp, null));
	}
})();

_module_hot.run();