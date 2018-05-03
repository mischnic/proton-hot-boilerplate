import React, { Component } from "react";
import { App, Window, render } from "proton-native";
import MyApp from "./app.js";

class HotApp extends Component {
	constructor(props) {
		super(props);

		this.state = { app: MyApp };

		if (module.hot) {
			module.hot.accept("./app.js", () => {
				import("./app.js").then(x => {
					this.setState({ app: x.default });
				});
			});
		}
	}

	render() {
		const Component = this.state.app;
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 500 }}>
					<Component />
				</Window>
			</App>
		);
	}
}

render(<HotApp />);
