import React, { Component, PureComponent } from "React";
import { Box, TextInput, Text } from "proton-native";

export default props => <Text>{`${props.val} ${props.test.x.y.z}`}</Text>;
