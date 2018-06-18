if (process.env.NODE_ENV !== "production") {
	const templateOptions = {
		placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/
	};

	const shouldIgnoreFile = file =>
		!!file
			.split("\\")
			.join("/")
			.match(/node_modules\/(react|react-hot-loader)([\/]|$)/);

	module.exports = function plugin(args) {
		if (this && this.callback) {
			throw new Error();
		}
		const { types: t, template } = args;
		const headerTemplate = template(
			`const { createProxy, getForceUpdate } = require("react-proxy");`,
			templateOptions
		);
		const shouldDoImport = /^\.?\.\//;
		const exportComponent = id =>
			t.objectExpression([
				t.objectProperty(t.identifier("___component"), id)
			]);

		const proxyTemplate = template(
			`const ID = (function() {
	if (IMPORTID && IMPORTID.___component) {
		const proxy = createProxy(IMPORTID.___component);
		HOT.accept(require.resolve(IMPORT), function() {
			const x = require(IMPORT)[NAME];
			const mountedInstances = proxy.update(
				x.___component
			);
			const forceUpdate = getForceUpdate(React);
			mountedInstances.forEach(forceUpdate);
		});
		return proxy.get();
	} else {
		return IMPORTID;
	}
})();`,
			templateOptions
		);

		const hotTemplate = template(
			`
const ID = (function() {
	if (module.hot) {
		const data = {};

		return {
			accept(file, cb) {
				if (!data[file]) data[file] = [];
				data[file].push(cb);
			},
			run() {
				for (let file of Object.keys(data)) {
					module.hot.accept(file, function() {
						for (let cb of data[file]) {
							cb(file);
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
})();
`,
			templateOptions
		);

		const runHotTemplate = template(`ID.run();`, templateOptions);

		const MODULE_HOT = Symbol("module.hot");

		return {
			visitor: {
				ExportDefaultDeclaration(path, opts) {
					if (path.node.declaration.type == "Identifier") {
						path.node.declaration = exportComponent(
							path.node.declaration
						);
					}
				},
				ExportNamedDeclaration(path, opts) {
					for (let s of path.node.specifiers) {
						const newId = path.scope.generateUidIdentifier(
							s.local.name
						);
						path.insertBefore(
							t.variableDeclaration("const", [
								t.variableDeclarator(
									newId,
									exportComponent(s.local)
								)
							])
						);
						const exported = s.exported.name;
						s.local = newId;
						s.exported = t.identifier(exported);
					}
				},
				ImportDeclaration(path, { file }) {
					if (path.node.source.value.match(shouldDoImport)) {
						for (let s of path.node.specifiers) {
							const oldId = s.local.name;
							const name = t.isImportDefaultSpecifier(s)
								? "default"
								: s.local.name;

							s.local = path.scope.generateUidIdentifierBasedOnNode(
								s.local
							);

							path.insertAfter(
								proxyTemplate({
									HOT: file[MODULE_HOT],
									ID: t.identifier(oldId),
									NAME: t.stringLiteral(name),
									IMPORTID: s.local,
									IMPORT: t.stringLiteral(
										path.node.source.value
									)
								})
							);
						}
					}
				},
				Program: {
					enter({ node, scope }, { file }) {
						if (!shouldIgnoreFile(file.opts.filename)) {
							node.body.unshift(headerTemplate());
						}
						file[MODULE_HOT] = scope.generateUidIdentifier(
							"module_hot"
						);
						node.body.unshift(
							hotTemplate({ ID: file[MODULE_HOT] })
						);
					},
					exit({ node }, { file }) {
						node.body.push(
							runHotTemplate({ ID: file[MODULE_HOT] })
						);
					}
				},
				Class(classPath, x) {}
			}
		};
	};
}
