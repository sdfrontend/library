module.exports = function(grunt) {

  grunt.initConfig({

    concat: {
      options: {
      },
      demo: {
        options: {
          sourceMap: true
        },
        src: ['assets/src/css/*.css', 'assets/dist/css/_components/**/*.css', 'assets/dist/css/_design/**/*.css', 'assets/src/css/site-styles.css'],
        dest: 'assets/dist/css/main.css'
      },
      dist: {
        options: {
          sourceMap: true
        },
        src: ['dist/css/_components/**/*.css', 'dist/css/_design/**/*.css'],
        dest: 'dist/css/main.css'
      }
    },

    sass: {
      /* The sass task compiles all _components/component.scss files into css files, 
       * and the same for  the _design/component.scss files.
       * These then both get concatenated down to the main.css, with correct sourcemapping
       */
      components: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: '',
          src: ['_components/**/scss/*.scss'],
          dest: 'dist/css',
          ext: '.css'
        }]
      },
      design: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: '',
          src: ['_design/**/scss/*.scss'],
          dest: 'dist/css',
          ext: '.css'
        }]
      },
      /* These tasks compile all _components/demo/component.scss files into css files, 
       * and the same for  the _design/demo/component.scss files, as well as the main
       * demo site styles .scss file.
       * These all then get concatenated down to the main demo site .css file, with correct sourcemapping
       */
      demo: {
        files: {
          'assets/src/css/site-styles.css': 'assets/src/scss/main.scss',
        }
      },
      componentsDemo: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: '',
          src: ['_components/**/demo/*.scss'],
          dest: 'assets/dist/css',
          ext: '.css'
        }]
      },
      designDemo: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: '',
          src: ['_design/**/demo/*.scss'],
          dest: 'assets/dist/css',
          ext: '.css'
        }]
      },
    },

    postcss: {
      /* The postcss script performs functions on the generated css files, at the moment it:
       * - automatically adds vender prefixes for the 'last 4 version' (i.e. automatically including -webkit-transition)
       * - minifies the css
       */
      options: {
        map: false, 
        processors: [
          require('autoprefixer')({browsers: 'last 4 versions'}), // add vendor prefixes
          require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: 'dist/css/main.css'
      },
      demo: {
        src: 'assets/dist/css/main.css'
      }
    },

    uglify: {
      /* The uglify script takes in all files in each components/designs /js sub-folder.
       * This allows us to include multiple scripts per component, for an example if we 
       * needed to include slick-slider.js for a carousel
       */
      dist: {
        src:  ['_components/**/js/*', '_design/**/js/*'],
        dest: 'dist/js/main.js'
      },
      demo: {
        src: ['_components/**/demo/demo.js', '_design/**/demo/demo.js', 'assets/src/js/*'],
        dest: 'assets/dist/js/main.js'
      }
    },

    jekyll: {
      options: {
        bundleExec: true
      },
      dist: {
        options: {}
      }
    },

    connect: {
			server: {
				options: {
					livereload: '9090',
          hostname: 'localhost',
					base: 'docs',
					port: 4000
				}
			}
		},

		watch: {
      options: {
        livereload: {
          host: 'localhost',
          port: 9090
        }
      },
			sass: {
				files: ['assets/src/scss/**/*', '_components/**/demo/demo.scss', 
                  '_design/**/scss/component.scss', '_components/**/scss/component.scss'],
				tasks: ['sass', 'concat', 'postcss', 'jekyll']
			},
			js: {
				files: ['<%= uglify.dist.src %>', '<%= uglify.demo.src %>'],
				tasks: ['uglify', 'jekyll']
			},
      demo: {
        files: ['_components/**/demo.md', '_design/**/demo.md', '_layouts/**/*', '_includes/**/*', '_plugins/**/*', '_assets/css/*'],
        tasks: ['jekyll']
      }
		},
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['sass', 'concat', 'postcss', 'uglify', 'jekyll']);
  grunt.registerTask('serve', ['sass', 'concat' ,'postcss', 'uglify', 'jekyll', 'connect', 'watch']);

};
