const Bundler = require('parcel-bundler');
const path = require('path');
const childProcess = require('child_process');

const file = path.join(__dirname, './raw/index.js');

const options = {outDir: './out', target: 'electron'};

(async () => {
	const bundler = new Bundler(file, options);
	await bundler.bundle();
	childProcess.fork(path.join(__dirname, 'out', './index.js'));
})();