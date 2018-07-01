import React from "React";
import { Text } from "proton-native";

export default {
	___component: class Example extends React.PureComponent {
		render() {
			return React.createElement(
				Text,
				null,
				"Test"
			);
		}
	}
};