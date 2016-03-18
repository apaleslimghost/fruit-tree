#!/usr/bin/env node

var fruitTree = require('./');
var promisify = require('@quarterto/promisify');
var findParentDir = promisify(require('find-parent-dir'));

findParentDir(
	process.cwd(),
	'package.json'
).then(
	basedir => process.argv.slice(2)
		.map(fruit => fruitTree(fruit, basedir))
).catch(console.error);
