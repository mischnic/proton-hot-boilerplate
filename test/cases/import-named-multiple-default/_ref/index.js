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

import React, { Component } from "React";
import { App, Window, render } from "proton-native";
import _MyApp, { Example as _Example, Test as _Test } from "./app.js";

const MyApp = function () {
	if (_MyApp && _MyApp.___component) {
		const proxy = _react_proxy.createProxy(_MyApp.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			const x = require("./app.js")["default"];

			const mountedInstances = proxy.update(x.___component);

			const forceUpdate = _react_proxy.getForceUpdate(React);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _MyApp;
	}
}();

const Example = function () {
	if (_Example && _Example.___component) {
		const proxy = _react_proxy.createProxy(_Example.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			const x = require("./app.js")["Example"];

			const mountedInstances = proxy.update(x.___component);

			const forceUpdate = _react_proxy.getForceUpdate(React);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _Example;
	}
}();

const Test = function () {
	if (_Test && _Test.___component) {
		const proxy = _react_proxy.createProxy(_Test.___component);

		_module_hot.accept(require.resolve("./app.js"), function () {
			const x = require("./app.js")["Test"];

			const mountedInstances = proxy.update(x.___component);

			const forceUpdate = _react_proxy.getForceUpdate(React);

			mountedInstances.forEach(forceUpdate);
		});

		return proxy.get();
	} else {
		return _Test;
	}
}();

class HotApp extends Component {
	render() {
		return React.createElement(
			App,
			null,
			React.createElement(
				Window,
				{ title: "Notes", size: { w: 500, h: 350 }, margined: true },
				React.createElement(MyApp, null),
				React.createElement(Example, null),
				React.createElement(Test, null)
			)
		);
	}
}

render(React.createElement(HotApp, null));

_module_hot.run();