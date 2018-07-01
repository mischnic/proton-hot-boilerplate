import React, { Component } from "React";
import { Text } from "proton-native";

export default {
	___component: class Example extends Component {
		render() {
			return React.createElement(
				Text,
				null,
				"Test"
			);
		}
	}
};