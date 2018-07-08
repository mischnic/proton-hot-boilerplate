import React, { Component } from "React";
import { App, Window, render as r } from "proton-native";

class HotApp extends Component {
	render() {
		return (
			<App>
				<Window title="Notes" size={{ w: 500, h: 350 }} margined>
					<Example />
				</Window>
			</App>
		);
	}
}

r(<HotApp />);
