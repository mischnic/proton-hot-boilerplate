import React, { PureComponent } from "React";
import { Text } from "proton-native";

export default {
	___component: class Example extends PureComponent {
		render() {
			return React.createElement(
				Text,
				null,
				"Test"
			);
		}
	}
};