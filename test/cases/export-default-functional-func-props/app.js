import React, { Component, PureComponent } from "React";
import { Text } from "proton-native";

export default function(props) {
	return <Text>{`${props.val} ${props.test.x.y.z}`}</Text>;
}
