import React, { Component, PureComponent } from "React";
import { Box, Text } from "proton-native";

class Example extends React.Component {
	render() {
		return React.createElement(
			Text,
			null,
			`${this.props.val} ${this.props.val.x.y.z}`
		);
	}

}

export default {
	___component: Example
};