var promiseAllObject = require('@quarterto/promise-all-object');
var mapValues = require('lodash.mapvalues');
var fs = require('fs-promise');
var path = require('path');

var template = fruit => ({
	[`lib/css/fruit/modules/_${fruit}.scss`]: `.${fruit} {}`,
	[`lib/templates/fruit/${fruit}.ms`]: '',
	[`lib/javascript/ftfruitmachine/modules/${fruit}.js`]: `const fm = require('fruitmachine');

module.exports = fm.define({
	name: '${fruit}',
	template: require('../../../templates/fruit/${fruit}.ms'),
});`,
	'lib/javascript/ftfruitmachine/modules/index.js': src => `${src}
require('./${fruit}.js')`,
	'lib/css/body-part2.scss': src => `${src}
@import "fruit/modules/${fruit}";`
});

module.exports = (fruit, basedir) => promiseAllObject(
	mapValues(
		template(fruit),
		(srcOrTransform, file) => {
			var resolved = path.resolve(basedir, file);
			return fs.exists(resolved)
				.then(exists => {
					if(exists) {
						return fs.readFile(resolved).then(orig => srcOrTransform(orig));
					} else {
						return srcOrTransform;
					}
				})
				.then(src => fs.writeFile(resolved, src));
		}
	)
);
