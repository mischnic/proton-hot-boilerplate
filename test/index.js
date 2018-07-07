const babel = require("babel-core");
const fs = require("fs");
process.chdir(__dirname);

const args = process.argv.slice(2).map(v => new RegExp(v));

let i = 0;
let failed = 0;

const ok = name => console.log(`ok ${++i} ${name}`);
const skip = name => console.log(`ok ${++i} ${name} # SKIP`);
const notOk = (name, msg) => {
	console.log(`not ok ${++i} ${name}`);
	console.log("  ---");
	msg.split("\n").forEach(v => {
		console.log(`    ${v}`);
	});
	console.log("  ...");
	failed++;
};

const transpileTo = (from, to, env) =>
	fs.writeFileSync(
		to,
		babel.transformFileSync(
			from,
			Object.assign(
				{
					ast: false
				},
				env
					? {
							babelrc: false,
							presets: ["env", "react"],
							plugins: ["../../../babel.js"]
					  }
					: {}
			)
		).code
	);

const unit = (name, env = false) => {
	// console.log(`# ${name}`);
	const displayName = name + (env ? " (env)" : "");
	if (args.length) {
		let found = false;
		for (let x of args) {
			if (x.test(displayName)) {
				found = true;
			}
		}
		if (!found) {
			return;
		}
	}
	const out = `units/${name}/_out${env ? "_env" : ""}`;
	const ref = `units/${name}/_ref${env ? "_env" : ""}`;

	if (!fs.existsSync(out)) {
		fs.mkdirSync(out);
	}

	const files = fs.readdirSync(`units/${name}`).filter(v => v.endsWith(".js"));
	const f = files[0];
	// for (let f of files) {
	try {
		transpileTo(`units/${name}/${f}`, `${out}/${f}`, env);
	} catch (e) {
		notOk(displayName, "Babel error:\n" + e);
		return;
		// continue;
	}

	if (fs.existsSync(`${ref}/${f}`)) {
		if (
			fs.readFileSync(`${out}/${f}`).toString() === fs.readFileSync(`${ref}/${f}`).toString()
		) {
			ok(displayName);
		} else {
			notOk(displayName, "Error: not equal");
			// TODO add diff, ignore indentation/empty lines
		}
	} else {
		skip(displayName);
		// if (!fs.existsSync(ref)) {
		// 	fs.mkdirSync(ref);
		// }
		// fs.copyFileSync(`${out}/${f}`, `${ref}/${f}`);
	}
	// }
};

console.log("TAP version 13");

console.log("# export default");
[
	"export-default-class",
	"export-default-class-superclass",
	"export-default-component",
	"export-default-component-anonymous",
	"export-default-component-react",
	"export-default-component-react-renamed",
	"export-default-component-renamed",
	"export-default-component-variable",
	"export-default-functional-arrow",
	"export-default-functional-arrow-props",
	"export-default-functional-arrow-variable",
	"export-default-functional-arrow-variable-props",
	"export-default-functional-func",
	"export-default-functional-func-props",
	"export-default-functional-func-variable",
	"export-default-functional-func-variable-props",
	"export-default-functional-func-variable-anonymous",
	"export-default-functional-func-variable-anonymous-props",
	"export-default-hoc-func",
	"export-default-purecomponent",
	"export-default-purecomponent-react",
	"export-default-purecomponent-variable"
].forEach(t => unit(t) || unit(t, true));

console.log("# export named");
[
	"export-named-class",
	"export-named-class-superclass",
	"export-named-class-anonymous",
	"export-named-component",
	"export-named-component-react",
	"export-named-component-react-renamed",
	"export-named-component-renamed",
	"export-named-functional-arrow",
	"export-named-functional-arrow-props",
	"export-named-functional-func",
	"export-named-functional-func-props",
	"export-named-functional-func-anonymous",
	"export-named-functional-func-anonymous-props",
	"export-named-hoc-arrow",
	"export-named-hoc-func",
	"export-named-hoc-func-anonymous"
].forEach(t => unit(t) || unit(t, true));

console.log("# import");
[
	"import-default",
	"import-named",
	"import-named-multiple",
	"import-named-multiple-default"
].forEach(t => unit(t) || unit(t, true));

console.log(`\n1..${i}`);
console.log(`\n# tests ${i}`);
if (i - failed) console.log(`# pass ${i - failed}`);
if (failed) console.log(`# fail ${failed}`);
console.log();
