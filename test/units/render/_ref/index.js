import React, { Component } from "React";
import { render } from "proton-native";

class HotApp extends Component {
	render() {
		return false;
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
			const forceUpdate = getForceUpdate(React);
			mountedInstances.forEach(forceUpdate);
		} else {
			proxy = createProxy(Wrapper);
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