/* jshint node:true */

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('intern');

	grunt.initConfig({
		all: [ '**/*.ts', '!tests/**/*.ts', '!node_modules/**/*.ts', '!**/templates/**/*.ts' ],
		ignoreDefinitions: [ '<%= all %>', '!**/*.d.ts' ],
		tests: [ 'tests/**/*.ts', '!tests/unit/temp/**/*.ts' ],

		clean: {
			generator: {
				src: [
					'**/{*.js,*.js.map}', '!node_modules/**/*'
				],
				filter: function (filepath) {
					var jsName = filepath.match(/(.*\.js)(?:\.map)?$/)[1];

					// Only clean .js and .js.map files if BOTH the JavaScript and the map file exist.
					// Since the only thing generating map files is grunt-ts, this targets only the
					// JavaScript files generated by that process (including JavaScript files
					// generated for TypeScript files that have been moved or deleted).
					return grunt.file.exists(jsName) && grunt.file.exists(jsName + '.map');
				}
			}
		},

		ts: {
			options: {
				target: 'es5',
				module: 'commonjs',
				sourceMap: true,
				noImplicitAny: true,
				fast: 'never'
			},
			generator: {
				src: [ '<%= ignoreDefinitions %>' ]
			},
			tests: {
				options: {
					module: 'amd'
				},
				src: [ '<%= tests %>', '!**/*.d.ts' ]
			}
		},

		watch: {
			generator: {
				files: [ '<%= all %>' ],
				tasks: [ 'ts:generator' ]
			},
			tests: {
				files: [ '<%= tests %>' ],
				tasks: [ 'ts:tests' ]
			}
		},

		intern: {
			client: {
				options: {
					config: 'tests/generator.intern'
				}
			}
		}
	});

	grunt.registerTask('test', [ 'intern:client' ]);
	grunt.registerTask('build', [ 'ts' ]);
	grunt.registerTask('default', [ 'ts', 'watch' ]);
};
