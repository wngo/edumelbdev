module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
        src: [
            '_design/js/*.js' // All JS in the libs folder

        ],
        dest: '_design/js/build/production.js',
    }
        },

        uglify: {
            build: {
                src: [
                '_design/js/build/production.js'
                ],
                dest: '_design/js/build/prduction.min.js'
            }
        },
        imagemin: {
    dynamic: {
        files: [{
            expand: true,
            cwd: 'images/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'images/build/'
        }]
    }
},
    autoprefixer: {
         options: {
            browsers: ['last 2 version']
        },
        multiple_files: {
            expand: true,
            flatten: true,
            src: '_design/build/main.css',
            dest: '_design/build/prefixed/'
                
            }
            
        },


sass: {
    dist: {
        options: {
            style: 'expanded'
        },
        files: {
            '_design/build/main.css': '_design/sass/main.scss'
        }
        }
    },
        
        watch: {
            scripts: {
    files: ['js/*.js'],
    tasks: ['jshint', 'concat', 'uglify'],
    options: {
      spawn: false,
    }
  },
  css: {
    files: ['css/*.scss'],
    tasks: ['sass', 'autoprefixer', 'cssmin'],
    options: {
      spawn: false,
    }
  },
  images: {
    files: ['images/**/*.{png,jpg,gif}', 'images/*.{png,jpg,gif}'],
    tasks: ['imagemin'],
    options: {
      spawn: false,
    }
  },
  html:{
    files: ['./**/*.html'],
    tasks: [],
    options: {
      spawn: false
    }
  }
},

cssmin: {
  combine: {
    files: {
      '_design/build/min/main.min.css': ['_design/build/mgse_design.css']
    }
  }
}



    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);
    
};
