const _module_hot = function () {
  if (module.hot) {
    const data = {};
    return {
      accept(file, cb) {
        if (!data[file]) data[file] = [];
        data[file].push(cb);
      },

      run() {
        const files = Object.keys(data);

        for (let f = 0; f < files.length; f++) {
          module.hot.accept(files[f], function () {
            const cbs = data[files[f]];

            for (let cb = 0; cb < cbs.length; cb++) {
              cbs[cb]();
            }
          });
        }
      }

    };
  } else {
    return {
      accept() {},

      run() {}

    };
  }
}();

const {
  createProxy,
  getForceUpdate
} = require("react-proxy");

import React, { Component, PureComponent } from "React";
import { Box, TextInput, Text } from "proton-native";

const Example = class Example extends React.Component {
  render() {
    return React.createElement(
      Text,
      null,
      `${this.props.val} ${this.props.val.x.y.z}`
    );
  }

};

export default Example;

_module_hot.run();