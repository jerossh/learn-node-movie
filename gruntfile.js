module.exports = function(grunt){

  grunt.initConfig({
    watch: {
      jade: {
        files:['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'chemas/**/*.js'],
//        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 4000
          },
          cwd: __dirname
        }
      }
    },

    machaTest: {
      options: {
        reporter: 'spec'  // NOTE: mean what?
      },
      src:['test/**/*.js']   //test all js files under the test file
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-concurrent')
  grunt.loadNpmTasks('grunt-macha-test')


  grunt.option('force', true)
  grunt.registerTask('default', ['concurrent'])

  grunt.registerTask('test', ['mochaTest'])
}
