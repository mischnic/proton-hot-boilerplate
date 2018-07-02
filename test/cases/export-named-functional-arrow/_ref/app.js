import React, { Component as C } from "React";
import { Text } from "proton-native";

class Example extends React.Component {
  render() {
    return React.createElement(
      Text,
      null,
      "Test"
    );
  }

}

const _Example = {
  ___component: Example
};


export { _Example as Example };