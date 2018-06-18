import React, { Component } from "react";
import { Box, TextInput, Text } from "proton-native";

class Example extends Component {
	render() {
		return (
			<Box padded>
				<TextInput />
				<Text>Test!</Text>
			</Box>
		);
	}
}

class Test extends Component {
	render() {
		return <Text>Hello</Text>;
	}
}

export default Example;
export { Test };
