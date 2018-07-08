const _react_proxy = require("react-proxy");

import React, { Component } from "React";
import { App, Window, Box, render } from "proton-native";
import _Example from "./app.js";

const Example = function () {
	if (_Example && _Example.___component) {
		const proxy = _react_proxy.createProxy(_Example.___component);

		module.hot.accept(require.resolve("./app.js"), function () {
			console.log("app.js")
			const x = require("./app.js")["default"];

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
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 350 }} margined>
					<Box padded>
						<Example />
					</Box>
				</Window>
			</App>
		);
	}
}

(() => {
	class Wrapper extends React.Component {
		render() {
			return <HotApp/>;
		}

	}

	if (module.hot) {
		let proxy;

		if (module.hot.data && module.hot.data.proxy) {
			const mountedInstances = module.hot.data.proxy.update(Wrapper);
			mountedInstances.forEach(i => i.forceUpdate());
		} else {
			proxy = _react_proxy.createProxy(Wrapper);
			render(React.createElement(proxy.get()));
		}

		module.hot.accept();
		module.hot.dispose(data => {
			data.proxy = proxy || module.hot.data && module.hot.data.proxy;
		});
	} else {
		render(React.createElement(HotApp, null));
	}
})();