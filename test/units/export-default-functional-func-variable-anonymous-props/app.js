import React, { Component, PureComponent } from "React";
import { Box, TextInput, Text } from "proton-native";

const Example = function(props) {
	return <Text>{`${props.val} ${props.val.x.y.z}`}</Text>;
};

export default Example;
