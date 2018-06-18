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
	if (IMPORTID.___component) {
		const proxy = createProxy(IMPORTID.___component);
		if (module.hot) {
			module.hot.accept(IMPORT, function() {
				const x = require(IMPORT)[NAME];
				console.log(IMPORT, NAME);
				const mountedInstances = proxy.update(
					x.___component
				);
				const forceUpdate = getForceUpdate(React);
				mountedInstances.forEach(forceUpdate);
			});
		}
		return proxy.get();
	} else {
		return IMPORTID;
	}
})();`,
			templateOptions
		);

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
				ImportDeclaration(path, opts) {
					if (path.node.source.value.match(shouldDoImport)) {
						for (let s of path.node.specifiers) {
							const oldId = s.local.name;
							s.local = path.scope.generateUidIdentifierBasedOnNode(
								s.local
							);

							const name = t.isImportDefaultSpecifier(s)
								? "default"
								: s.local.name;
							path.insertAfter(
								proxyTemplate({
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
					}
				},
				Class(classPath, x) {}
			}
		};
	};
}
