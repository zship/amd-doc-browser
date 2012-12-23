
module.exports = function( grunt ) {

	'use strict';


	grunt.initConfig({
		pkg: '<json:package.json>',

		meta: {
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> | MIT license | <%= pkg.homepage %> */'
		},

		staging: 'temp',

		output: 'production',

		mkdirs: {
			staging: 'app'
		},


		clean: {
			build: ['temp', 'dist']
		},


		// concat css/**/*.css files, inline @import, output a single minified css
		css: {
			'styles/main.css': ['styles/**/*.css']
		},


		rev: {
			js: 'js/app.js'
		},


		'usemin-handler': {
			html: 'temp/index.html'
		},


		// update references in HTML/CSS to revved files
		usemin: {
			html: ['temp/index.html'],
			css: ['css/**/*.css']
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


		min: {
			dist: ''
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
					'dist/css/': 'temp/css/built.css',
					'dist/js/': 'temp/js/built.js',
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


		requirejs: {
			baseUrl: 'temp/js',
			optimize: 'none',

			paths: {
				'jquery': 'jquery-1.7.2',
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
	grunt.registerTask('build', 'clean copy:temp less concat:temp/css/built.css usemin-handler dist usemin copy:production');

};
