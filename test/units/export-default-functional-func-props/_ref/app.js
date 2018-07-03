import React, { Component, PureComponent } from "React";
import { Text } from "proton-native";

export default {
	___component: class extends React.Component {
		render() {
			return React.createElement(
				Text,
				null,
				`${this.props.val} ${this.props.test.x.y.z}`
			);
		}

	}
};