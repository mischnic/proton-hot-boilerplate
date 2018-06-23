import React, { Component, PureComponent } from "React";
import { Box, TextInput, Text } from "proton-native";

class Example extends PureComponent {
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

export default props => <Text>{`${props.val}`}</Text>;
// export default function(props){return <Text>{props.val}</Text>};
export { Example, Test };
