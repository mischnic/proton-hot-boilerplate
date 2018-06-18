import React, { Component } from "react";
import { Box, TextInput, Text } from "proton-native";

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

// function Test(props){return <Text>{props.text.x}</Text>};
const Test = props => <Text>{props.text.x}</Text>;

export default (props) => <Text>{props.val}</Text>;
// export default function(props){return <Text>{props.val}</Text>};
export { Example, Test };
