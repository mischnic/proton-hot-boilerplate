import React, { Component, PureComponent } from "React";
import { Box, TextInput, Text } from "proton-native";

function Example(props) {
	return <Text>{`${props.val} ${props.val.x.y.z}`}</Text>;
}

export default Example;
