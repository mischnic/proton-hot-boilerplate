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
	// TODO fix double import ?
	const headerTemplate = template(`const ID = require("react-proxy");`, templateOptions);
	const shouldDoImport = /^\.?\.\//;
	// @returns {
	//		___component: id
	//	}
	const componentToExportTemplate = id =>
		t.objectExpression([t.objectProperty(t.identifier("___component"), id)]);

	// replace import with a proxy if ___component is present
	const importProxyTemplate = template(
		`const ID = (function() {
	if (IMPORTID && IMPORTID.___component) {
		const proxy = PROXY.createProxy(IMPORTID.___component);
		HOT.accept(require.resolve(IMPORT), function() {
			const x = require(IMPORT)[NAME];
			const mountedInstances = proxy.update(
				x.___component
			);
			const forceUpdate = PROXY.getForceUpdate(React);
			mountedInstances.forEach(forceUpdate);
		});
		return proxy.get();
	} else {
		return IMPORTID;
	}
})();`,
		templateOptions
	);

	// Wrapper for module.hot to support multiple module.hot.accept calls for the same file
	const hotWrapperTemplate = template(
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

	// Run the hot wrapper
	const hotWrapperRunTemplate = template(`ID.run();`, templateOptions);

	/* 	
	const renderTemplate = template(
			`(function(){
	render(COMPONENT);
	if(module.hot){
		module.hot.accept();
	}

	})();`,
			templateOptions
		);
	*/

	// Keys to keep information on file object
	const MODULE_HOT = Symbol("Wrapper(module.hot)");
	const REACT_COMPS = Symbol("React Components");
	const PROXY_IMPORT = Symbol("react-proxy imports");

	const ensureHotWrapper = file => {
		// insert the proxy import
		if (!file[PROXY_IMPORT]) {
			file[PROXY_IMPORT] = file.path.scope.generateUidIdentifier("react_proxy");
			file.path.node.body.unshift(headerTemplate({ ID: file[PROXY_IMPORT] }));
		}

		// insert the module hot wrapper
		if (!file[MODULE_HOT]) {
			file[MODULE_HOT] = file.path.scope.generateUidIdentifier("module_hot");
			file.path.node.body.unshift(hotWrapperTemplate({ ID: file[MODULE_HOT] }));
		}
	};

	// Have we seen this class name as a Component declaration already?
	const declaredAsReactComp = (file, name) =>
		file[REACT_COMPS].findIndex(v => v.name === name) !== -1;

	const isReactComp = (node, scope) => {
		if (t.isIdentifier(node.superClass)) {
			// extends [Pure]Component
			const superClass = scope.getBinding(node.superClass.name);
			if (
				superClass &&
				t.isImportDeclaration(superClass.path.parent) &&
				superClass.path.parent.source.value.toLowerCase() == "react" &&
				(superClass.path.node.imported.name === "Component" ||
					superClass.path.node.imported.name === "PureComponent")
			) {
				return true;
			}
		} else if (t.isMemberExpression(node.superClass)) {
			// extends React.[Pure]Component
			const superClass = scope.getBinding(node.superClass.object.name);
			if (
				superClass &&
				superClass.path.parent.source.value.toLowerCase() == "react" &&
				(node.superClass.property.name === "Component" ||
					node.superClass.property.name === "PureComponent")
			) {
				return true;
			}
		}

		return false;
	};

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

		p.traverse({
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

	// Turn a functional component into a class component
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
			id: name ? t.identifier(name) : null,
			// TODO PureComponent?
			superClass: t.memberExpression(t.identifier("React"), t.identifier("Component")),
			body: t.classBody([
				t.classMethod(
					"method",
					t.identifier("render"),
					[],
					// TODO handle arrow function
					!t.isBlockStatement(body) ? t.blockStatement([t.returnStatement(body)]) : body
				)
			])
		};
	};

	return {
		visitor: {
			// replace exports with a object to identify react component imports later on
			ExportDefaultDeclaration(path, { file }) {
				if (!shouldIgnoreFile(file.opts.filename)) {
					if (
						t.isIdentifier(path.node.declaration) &&
						isUpperCase(path.node.declaration.name) &&
						declaredAsReactComp(file, path.node.declaration.name)
					) {
						// a class is exported by identifier
						path.node.declaration = componentToExportTemplate(path.node.declaration);
					} else if (
						// a class is exported directly
						t.isClassDeclaration(path.node.declaration) &&
						(path.node.declaration.id
							? isUpperCase(path.node.declaration.id.name)
							: true) &&
						isReactComp(path.node.declaration, path.scope)
					) {
						path.node.declaration = componentToExportTemplate(
							Object.assign({}, path.node.declaration, {
								type: "ClassExpression"
							})
						);
					} else if (
						t.isIdentifier(path.node.declaration)
							? couldBeFunctionalComponent(path.scope, path.node.declaration.name)
							: // TODO add check if function
							  couldBeFunctionalComponent(path, null, false)
					) {
						// a function is exported
						if (t.isIdentifier(path.node.declaration)) {
							// by identifier
							const funcDeclaration = path.scope.getBinding(
								path.node.declaration.name
							).path;
							const body =
								funcDeclaration.node.body || funcDeclaration.node.init.body;
							const params =
								funcDeclaration.node.params || funcDeclaration.node.init.params;

							const set = x => {
								if (funcDeclaration.node.init) funcDeclaration.node.init = x;
								else funcDeclaration.node = x;
							};

							set(
								functionToClass(
									funcDeclaration.node.id.name,
									funcDeclaration,
									body,
									params,
									"ClassExpression"
								)
							);
						} else {
							// directly
							const { body, params } = path.node.declaration;
							path.node.declaration = componentToExportTemplate(
								functionToClass(null, path, body, params, "ClassExpression")
							);
						}
					}
				}
			},
			ExportNamedDeclaration(path, { file }) {
				for (let s of path.node.specifiers) {
					// heuristic for detecting react component
					// TODO unify with default export?
					if (isUpperCase(s.local.name)) {
						const exported = s.exported.name;
						const newId = path.scope.generateUidIdentifier(s.local.name);
						let result;
						if (!declaredAsReactComp(file, s.local.name)) {
							if (couldBeFunctionalComponent(path.scope, s.local.name)) {
								// rewrite functional into React.Component subclass
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
							t.variableDeclarator(newId, componentToExportTemplate(s.local))
						]);

						s.local = newId;
						s.exported = t.identifier(exported);
						path.insertBefore(result);
					}
				}
			},

			// replace imports with hot reloading proxy wrappers if a component is imported
			ImportDeclaration(path, { file }) {
				if (path.node.source.value.match(shouldDoImport)) {
					for (let s of path.node.specifiers) {
						const oldId = s.local.name;
						const name = t.isImportDefaultSpecifier(s) ? "default" : s.local.name;

						s.local = path.scope.generateUidIdentifierBasedOnNode(s.local);

						ensureHotWrapper(file);

						path.insertAfter(
							importProxyTemplate({
								HOT: file[MODULE_HOT],
								PROXY: file[PROXY_IMPORT],
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
						// run the module.hot wrapper
						if (file[MODULE_HOT])
							path.node.body.push(hotWrapperRunTemplate({ ID: file[MODULE_HOT] }));
					}
				}
			},
			ClassDeclaration({ node, scope }, { file }) {
				// Maintain a list of React.Component subclasses
				if (isReactComp(node, scope)) {
					file[REACT_COMPS].push(node.id);
				}
			}
		}
	};
};
