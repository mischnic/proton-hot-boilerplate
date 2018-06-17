import React, { Component } from "react";
import {
	render,
	Window,
	App,
	Box,
	Button,
	Slider,
	TextInput,
	Text,
	Separator
} from "proton-native";

class Example extends Component {
	render() {
		return (
			<Box padded>
				<TextInput />
				<Text>Test</Text>
			</Box>
		);
	}
}

export default Example;
