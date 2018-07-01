import X, { Component } from "React";
import { Text } from "proton-native";

export default {
	___component: class extends X.Component {
		render() {
			return React.createElement(
				Text,
				null,
				"Test"
			);
		}
	}
};