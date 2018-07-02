const babel = require("babel-core");
const fs = require("fs");
process.chdir(__dirname);

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

const transpileTo = (from, to) =>
	fs.writeFileSync(
		to,
		babel.transformFileSync(from, {
			ast: false
		}).code
	);

const testCase = name => {
	// console.log(`# ${name}`);
	if (!fs.existsSync(`cases/${name}/_out`)) {
		fs.mkdirSync(`cases/${name}/_out`);
	}

	const files = fs.readdirSync(`cases/${name}`).filter(v => v.endsWith(".js"));
	const f = files[0];
	// for (let f of files) {
	try {
		transpileTo(`cases/${name}/${f}`, `cases/${name}/_out/${f}`);
	} catch (e) {
		notOk(name, "Babel error:\n" + e);
		return;
		// continue;
	}

	if (
		fs.existsSync(`cases/${name}/_ref/${f}`) &&
		fs.readFileSync(`cases/${name}/_out/${f}`).toString() ===
			fs.readFileSync(`cases/${name}/_ref/${f}`).toString()
	) {
		ok(name);
	} else {
		notOk(name, "Error: not equal");
		// TODO add diff
	}
	// }
};

console.log("TAP version 13");

console.log("# export default");
testCase("export-default-component");
testCase("export-default-component-anonymous");
testCase("export-default-component-react");
testCase("export-default-component-react-renamed");
testCase("export-default-component-renamed");
testCase("export-default-component-variable");
testCase("export-default-functional-arrow");
testCase("export-default-functional-arrow-props");
testCase("export-default-functional-arrow-variable");
testCase("export-default-functional-arrow-variable-props");
testCase("export-default-functional-func");
testCase("export-default-functional-func-props");
testCase("export-default-functional-func-variable");
testCase("export-default-functional-func-variable-props");
testCase("export-default-purecomponent");
testCase("export-default-purecomponent-react");
testCase("export-default-purecomponent-variable");

console.log("# export named");
testCase("export-named-component");
testCase("export-named-component-react");
testCase("export-named-component-react-renamed");
testCase("export-named-component-renamed");
testCase("export-named-functional-arrow");
testCase("export-named-functional-arrow-props");
testCase("export-named-functional-func");
testCase("export-named-functional-func-props");

console.log(`\n1..${i}`);
console.log(`\n# tests ${i}`);
if (i - failed) console.log(`# pass ${i - failed}`);
if (failed) console.log(`# fail ${failed}`);
console.log();
