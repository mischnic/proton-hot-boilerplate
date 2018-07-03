import React, { Component as C } from "React";
import { Text } from "proton-native";

const Example = function(props) {
	return <Text>{`${props.x}`}</Text>;
};

export { Example };
