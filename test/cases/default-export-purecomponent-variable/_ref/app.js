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

import React, { PureComponent } from "React";
import { Text } from "proton-native";

class Example extends PureComponent {
	render() {
		return React.createElement(
			Text,
			null,
			"Test"
		);
	}
}

export default {
	___component: Example
};

_module_hot.run();