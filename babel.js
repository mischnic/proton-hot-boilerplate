const templateOptions = {
	placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/
};

const isUpperCase = v => v[0] === v[0].toUpperCase();

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
		t.objectExpression([t.objectProperty(t.identifier("___component"), id)]);

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
				const files = Object.keys(data);
				for (let f = 0; f < files.length; f++) {
					module.hot.accept(files[f], function() {
						const cbs = data[files[f]];
						for (let cb = 0; cb < cbs.length; cb++ ) {
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
})();
`,
		templateOptions
	);

	const runHotTemplate = template(`ID.run();`, templateOptions);

	// 	const renderTemplate = template(
	// 		`(function(){
	// render(COMPONENT);
	// if(module.hot){
	// 	module.hot.accept();
	// }

	// })();`,
	// 		templateOptions
	// 	);

	const MODULE_HOT = Symbol("module.hot");
	const REACT_COMPS = Symbol("react component");

	const isReactComp = (file, name) => file[REACT_COMPS].findIndex(v => v.name === name) !== -1;

	const couldBeFunctionalComponent = (scopeOrPath, name, checkType = true) => {
		let found = false;
		const p = name ? scopeOrPath.getBinding(name).path : scopeOrPath;

		if (checkType) {
			if (
				!t.isFunctionDeclaration(p.node) &&
				!(
					t.isVariableDeclarator(p.node) &&
					(t.isFunctionExpression(p.node.init) ||
						t.isArrowFunctionExpression(p.node.init))
				)
			) {
				return false;
			}
		}

		const x = p.traverse({
			MemberExpression(path, opts) {
				if (
					t.isIdentifier(path.node.object) &&
					path.node.object.name === "React" &&
					t.isIdentifier(path.node.property) &&
					path.node.property.name === "createElement"
				) {
					found = true;
					path.stop();
				}
			},
			JSXElement(path, opts) {
				found = true;
				path.stop();
			}
		});

		return found;
	};

	const functionToClass = (name, declaration, body, params, type = "ClassDeclaration") => {
		if (params[0]) {
			// props
			const propName = params[0].name;
			if (t.isFunctionDeclaration(declaration.node)) {
				declaration.scope.rename(propName, "this.props");
			} else {
				declaration.traverse({
					MemberExpression(path, opts) {
						const node = path.node;
						path.skip();

						let x = node;
						let partList = [];
						while (x.object) {
							if (x.object.name) {
								if (x.object.name == propName) {
									x.object = t.memberExpression(
										t.thisExpression(),
										t.identifier(x.object.name)
									);
								}
								break;
							}
							x = x.object;
						}
					}
				});
			}
		}

		return {
			type,
			id: t.identifier(name),
			superClass: t.memberExpression(t.identifier("React"), t.identifier("Component")),
			body: t.classBody([
				t.classMethod(
					"method",
					t.identifier("render"),
					[],
					// handle arrow function
					!t.isBlockStatement(body) ? t.blockStatement([t.returnStatement(body)]) : body
				)
			])
		};
	};

	return {
		visitor: {
			ExportDefaultDeclaration(path, { file }) {
				if (
					t.isIdentifier(path.node.declaration) &&
					isUpperCase(path.node.declaration.name) &&
					isReactComp(file, path.node.declaration.name)
				) {
					path.node.declaration = exportComponent(path.node.declaration);
				} else {
					if (couldBeFunctionalComponent(path, null, false)) {
						const { body, params } = path.node.declaration;
						path.node.declaration = exportComponent(
							functionToClass("Test", path, body, params, "ClassExpression")
						);
					}
				}
			},
			ExportNamedDeclaration(path, { file }) {
				for (let s of path.node.specifiers) {
					if (isUpperCase(s.local.name)) {
						const exported = s.exported.name;
						const newId = path.scope.generateUidIdentifier(s.local.name);
						let result;
						if (!isReactComp(file, s.local.name)) {
							if (couldBeFunctionalComponent(path.scope, s.local.name)) {
								// rewrite stateless into React.Component subclass
								const declaration = path.scope.getBinding(s.local.name).path;
								const body = declaration.node.body || declaration.node.init.body;
								const params =
									declaration.node.params || declaration.node.init.params;

								(t.isFunctionDeclaration(declaration.node)
									? declaration
									: declaration.parentPath
								).replaceWith(functionToClass(exported, declaration, body, params));
							} else {
								continue;
							}
						}

						result = t.variableDeclaration("const", [
							t.variableDeclarator(newId, exportComponent(s.local))
						]);

						s.local = newId;
						s.exported = t.identifier(exported);
						path.insertBefore(result);
					}
				}
			},
			ImportDeclaration(path, { file }) {
				if (path.node.source.value.match(shouldDoImport)) {
					for (let s of path.node.specifiers) {
						const oldId = s.local.name;
						const name = t.isImportDefaultSpecifier(s) ? "default" : s.local.name;

						s.local = path.scope.generateUidIdentifierBasedOnNode(s.local);

						path.insertAfter(
							proxyTemplate({
								HOT: file[MODULE_HOT],
								ID: t.identifier(oldId),
								NAME: t.stringLiteral(name),
								IMPORTID: s.local,
								IMPORT: t.stringLiteral(path.node.source.value)
							})
						);
					}
				}
			},
			Program: {
				enter({ node, scope }, { file }) {
					if (!shouldIgnoreFile(file.opts.filename)) {
						node.body.unshift(headerTemplate());

						file[MODULE_HOT] = scope.generateUidIdentifier("module_hot");
						node.body.unshift(hotTemplate({ ID: file[MODULE_HOT] }));

						file[REACT_COMPS] = [];
					}
				},
				exit(path, { file }) {
					// path.traverse({
					// 	CallExpression(path, opts) {
					// 		// patch the top-level render call
					// 		if (path.node.callee.name === "render") {
					// 			path.replaceWith(
					// 				renderTemplate({ COMPONENT: path.node.arguments[0] })
					// 			);
					// 			path.stop();
					// 		}
					// 	}
					// });
					if (!shouldIgnoreFile(file.opts.filename)) {
						path.node.body.push(runHotTemplate({ ID: file[MODULE_HOT] }));
					}
				}
			},
			ClassDeclaration({ node, scope }, { file }) {
				// Maintain a list of React.Component subclasses
				if (t.isIdentifier(node.superClass)) {
					const superClass = scope.getBinding(node.superClass.name);
					if (
						superClass &&
						t.isImportDeclaration(superClass.path.parent) &&
						superClass.path.parent.source.value == "react"
					) {
						file[REACT_COMPS].push(node.id);
					}
				} else if (
					t.isMemberExpression(node.superClass) &&
					node.superClass.object.name === "React" &&
					node.superClass.property.name === "Component"
				) {
					file[REACT_COMPS].push(node.id);
				}
			}
		}
	};
};
