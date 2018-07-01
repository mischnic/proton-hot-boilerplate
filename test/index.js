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
		notOk(f, "Error: not equal");
		// TODO add diff
	}
	// }
};

console.log("TAP version 13");

console.log("# default export");
testCase("default-export-component");
testCase("default-export-component-anonymous");
testCase("default-export-component-react");
testCase("default-export-component-react-renamed");
testCase("default-export-component-renamed");
testCase("default-export-component-variable");
testCase("default-export-functional");
testCase("default-export-functional-props");
testCase("default-export-functional-variable");
testCase("default-export-functional-variable-props");
testCase("default-export-purecomponent");
testCase("default-export-purecomponent-react");
testCase("default-export-purecomponent-variable");

console.log(`\n1..${i}`);
console.log(`\n# tests ${i}`);
if (i - failed) console.log(`# pass ${i - failed}`);
if (failed) console.log(`# fail ${failed}`);
console.log();
