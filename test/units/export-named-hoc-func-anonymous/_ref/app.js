import React, { Component } from "React";
import { Text } from "proton-native";

const Example = function (Component) {
	return class extends React.Component {
		render() {
			return React.createElement(Component, this.props);
		}
	};
};

export { Example };