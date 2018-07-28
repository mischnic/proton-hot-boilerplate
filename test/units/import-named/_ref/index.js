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
import { Example as _Example } from "./app.js";

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

class HotApp extends Component {
	render() {
		return React.createElement(
			App,
			null,
			React.createElement(
				Window,
				{ title: "Notes", size: { w: 500, h: 350 }, margined: true },
				React.createElement(Example, null)
			)
		);
	}
}

_module_hot.run();