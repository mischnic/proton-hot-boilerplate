import React, { Component } from "React";
import { Text } from "proton-native";

const Example = Component => {
	return class extends React.Component {
		render() {
			return <Component {...this.props} />;
		}
	};
};

export { Example };
