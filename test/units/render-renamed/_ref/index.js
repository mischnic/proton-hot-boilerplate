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
import { App, Window, render as r } from "proton-native";

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

(() => {
	class Wrapper extends React.Component {
		render() {
			return React.createElement(HotApp, null);
		}

	}

	if (module.hot) {
		let proxy;

		if (module.hot.data && module.hot.data.proxy) {
			const mountedInstances = module.hot.data.proxy.update(Wrapper);
			mountedInstances.forEach(i => i.forceUpdate());
		} else {
			proxy = _react_proxy.createProxy(Wrapper);
			r(React.createElement(proxy.get()));
		}

		module.hot.accept();
		module.hot.dispose(data => {
			data.proxy = proxy || module.hot.data && module.hot.data.proxy;
		});
	} else {
		r(React.createElement(HotApp, null));
	}
})();

_module_hot.run();