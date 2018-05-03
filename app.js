import React, { Component } from "react";
import fs from "fs";
import {
	render,
	Window,
	App,
	TextInput,
	Dialog,
	Menu,
	Box,
	Button
} from "proton-native";

class Notepad extends Component {
	state = { text: "Enter here!" };

	render() {
		return (
			<Box>
				<TextInput onChange={text => this.setState({ text })}>
					{this.state.text}
				</TextInput>
				<Button>Test</Button>
			</Box>
		);
	}
}

export default Notepad;
