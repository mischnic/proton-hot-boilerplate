import React, { Component } from "React";
import { Text } from "proton-native";

export function Example(Component) {
	return class extends React.Component {
		render() {
			return React.createElement(Component, this.props);
		}
	};
}