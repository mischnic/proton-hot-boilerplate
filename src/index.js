import React, { Component } from "react";
import { App, Window, render, Box } from "proton-native";
import MyApp, {Test} from "./app.js";

class HotApp extends Component {
	render() {
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 350 }} margined>
					<Box padded>
						<MyApp />
						<Test/>
					</Box>
				</Window>
			</App>
		);
	}
}

render(<HotApp />);
