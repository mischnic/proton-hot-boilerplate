import React, { Component } from "react";
import { App, Window, render } from "proton-native";
import MyApp from "./app.js";
import { createProxy, getForceUpdate } from "react-proxy";

const proxy = createProxy(MyApp);
const Proxy = proxy.get();

class HotApp extends Component {
	constructor(props) {
		super(props);

		if (module.hot) {
			module.hot.accept("./app.js", () => {
				import("./app.js").then(x => {
					const mountedInstances = proxy.update(x.default);
					const forceUpdate = getForceUpdate(React);
					mountedInstances.forEach(forceUpdate);
				});
			});
		}
	}

	render() {
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 350 }} margined>
					<Proxy />
				</Window>
			</App>
		);
	}
}

render(<HotApp />);
