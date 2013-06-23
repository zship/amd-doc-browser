var path = require('path');
var fs = require('fs');

module.exports = function( grunt ) {

	'use strict';


	grunt.initConfig({
		pkg: '<json:package.json>',

		meta: {
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> | MIT license | <%= pkg.homepage %> */'
		},

		staging: 'temp',

		output: 'dist',

		mkdirs: {
			staging: 'app'
		},


		clean: {
			build: ['temp', 'dist']
		},


		css: {
			'styles/main.css': ['styles/**/*.css']
		},


		rev: {
			js: 'temp/js/built.min.js',
			css: 'temp/css/built.css',
			html: 'temp/doc/**/*.html'
		},

		cacheRev: 'dist/js/rev.json',


		'usemin-handler': {
			html: 'temp/index.html'
		},


		// update references in HTML/CSS to revved files
		usemin: {
			html: ['temp/index.html']
		},


		// HTML minification
		html: {
			files: ['**/*.html']
		},


		img: {
			dist: ''
		},


		less: {
			development: {
				files: {
					'temp/css/built.css': [
						'temp/css/code-dark.less',
						'temp/css/code-light.less',
						'temp/css/style.less',
						'temp/css/colors.less'
					]
				}
			}
		},


		concat: {
			'temp/css/built.css': [
				'temp/css/normalize.css',
				'temp/css/font-awesome.css',
				'temp/css/built.css',
				'temp/css/icomoon.css'
			]
		},


		copy: {
			temp: {
				files: {
					'temp/': 'app/**'
				}
			},
			production: {
				files: {
					'dist/': 'temp/index.html',
					'dist/css/': 'temp/css/*.built.css',
					'dist/js/': 'temp/js/*.built.min.js',
					'dist/doc/': 'temp/doc/**',
					'dist/font/': 'temp/font/**'
				}
			}
		},


		dist: {
			out: 'temp/js/built.js',
			//remove requirejs dependency from built package (almond)
			standalone: true,
			//build standalone for node or browser
			//env: 'node',
			env: 'browser',
			exports: 'app',
			//String or Array of files for which to trace dependencies and build
			//include: ['joss/geometry/**', 'joss/util/**', 'jossx/validation/**'],
			include: 'temp/js/app/**/*.js',
			//exclude files from the 'include' list. Useful to add specific
			//exceptions to globbing.
			//exclude: ['joss/util/collection/**'],
			//exclude files and their dependencies from the *built* source
			//Difference from 'exclude': files in 'excludeBuilt' will be
			//excluded even if they are dependencies of files in 'include'
			excludeBuilt: [],
			//exclude files from the *built* source, but keep any dependencies of the files.
			excludeShallow: []
		},


		min: {
			dist: {
				src: ['<banner>', '<config:dist.out>'],
				dest: 'temp/js/built.min.js'
			}
		},


		requirejs: {
			baseUrl: 'temp/js',
			optimize: 'none',

			paths: {
				'jquery.hashchange': 'jquery.ba-hashchange',
				'jquery.event.input': 'jquery/jquery.event.input',
				'jquery.event.drag': 'jquery/jquery.event.drag-2.0'
			}
		}

	});

	grunt.loadNpmTasks('yeoman');
	grunt.loadNpmTasks('grunt-amd-dist');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');

	//grunt.registerTask('default', 'clean mkdirs concat css min rev usemin manifest');
	//grunt.registerTask('default', 'clean mkdirs rev usemin');
	grunt.registerTask('build', 'clean copy:temp less concat:temp/css/built.css dist min usemin-handler rev usemin copy:production cacheRev');

	//Override some Yeoman tasks/helpers
	
	//'replace' assumes we're in the staging directory. The 'mkdirs' task does
	//grunt.file.setBase(<staging>) in yeoman (at least one of the developers
	//commented that this is a bad practice...).  We're not using mkdirs, so
	//mimick that awful stateful behavior here.
	grunt.renameHelper('replace', 'yeomanReplace');

	grunt.registerHelper('replace', function(content, regexp) {
		var base = grunt.config('base') || grunt.option('base') || process.cwd();
		grunt.file.setBase(grunt.config('staging'));

		var ret = grunt.helper('yeomanReplace', content, regexp);

		grunt.file.setBase(base);
		return ret;
	});

	var revisions = {};

	grunt.registerMultiTask('rev', 'Automate the hash renames of assets filename', function() {
		var files = this.data;
		grunt.file.expandFiles(files).forEach(function(f) {
			var md5 = grunt.helper('md5', f),
			renamed = [md5.slice(0, 8), path.basename(f)].join('.');

			//removing the staging path from the file name
			revisions[f.split('/').slice(1).join('/')] = path.join(path.dirname(f), renamed).split('/').slice(1).join('/');

			grunt.verbose.ok().ok(md5);
			// create the new file
			fs.renameSync(f, path.resolve(path.dirname(f), renamed));
			grunt.log.write(f + ' ').ok(renamed);
		});
	});


	grunt.registerTask('cacheRev', 'Store hash revision filenames in a JSON structure for client-side AJAX calls to use', function() {
		var filename = grunt.config.get(this.name);
		grunt.file.write(filename, JSON.stringify(revisions, false, 4), 'utf-8');
	});

};
