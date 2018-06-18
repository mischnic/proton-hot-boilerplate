import React, { Component } from "react";
import { App, Window, render, Box } from "proton-native";
import MyApp, { Example, Test } from "./app.js";

class HotApp extends Component {
	render() {
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 350 }} margined>
					<Box padded>
						<Example />
						<MyApp val={10} />
						<Test text={{ x: "???" }} />
					</Box>
				</Window>
			</App>
		);
	}
}

render(<HotApp />);
