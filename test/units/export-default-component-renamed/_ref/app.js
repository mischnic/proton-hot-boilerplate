import React, { Component as C } from "React";
import { Text } from "proton-native";

export default {
	___component: class extends C {
		render() {
			return React.createElement(
				Text,
				null,
				"Test"
			);
		}
	}
};