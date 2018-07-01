import React, { PureComponent } from "React";
import { Text } from "proton-native";

class Example extends PureComponent {
	render() {
		return React.createElement(
			Text,
			null,
			"Test"
		);
	}
}

export default {
	___component: Example
};