import React, { Component } from "react";
import { Box, TextInput, Text } from "proton-native";

class Example extends Component {
	render() {
		return (
			<Box padded>
				<TextInput />
				<Text>Tester</Text>
			</Box>
		);
	}
}

const Test = props => <Text>{props.text.x}</Text>;

export default Example;
export { Test };
