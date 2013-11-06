// Copyright Romain Francez and other string contributors.
//
// This file is part of string.
//
// string is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License.
//
// string is distributed in the hope that it will be useful,
// but WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE. See the GNU General Public License
// for more details.
//
// You should have received a copy of the GNU General Public License
// along with string.  If not, see <http://www.gnu.org/licenses/>.

(function () {
  'use strict';

  var
    grunt,
    concatIndexRegexp = /.*index.js$/,
    removeUseStrictRegexp = /(^|\n[ \t]*)('use strict'|"use strict")\s*;?\s*/g,
    removeFunctionStartRegexp = /(^|\n[ \t]*)\(function\s*\([^\)]*\)\s*{\s*/,
    removeFunctionEndRegexp = /(^|\n[ \t]*)}\s*\(\s*\)\s*\)\s*;?\s*/;

  grunt = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        options: {
          separator: '\n',
        },
        dist: {
          src: ['lib/**/*.js'],
          dest: 'js/<%= pkg.name %>.js',
          options: {
            banner: '(function () {\n  \'use strict\';\n',
            footer: '}());',
            process: function(src, filepath) {
              var
                indexMatches = filepath.match(concatIndexRegexp);

              if (indexMatches !== null &&
                indexMatches.constructor === Array &&
                indexMatches.length > 0) {
                return '';
              }
              return '// Source: ' + filepath + '\n' +
                src.replace(removeUseStrictRegexp, '$1')
                   .replace(removeFunctionStartRegexp, '$1  ')
                   .replace(removeFunctionEndRegexp, '$1');
            }
          }
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> | ' +
           '(c) <%= grunt.template.today ("yyyy") %> ' +
           'Romain Francez and other string contributors | GPLv3 */\n'
        },
        dist: {
          files: {
            'js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
          }
        }
      },
      jshint: {
        files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          jshintrc: '.jshintrc'
        }
      },
      watch: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'nodeunit:module']
      },
      nodeunit: {
        min: ['test/min/**/*.test.js'],
        module: ['test/module/**/*.test.js']
      },
      jsdoc : {
        dist : {
          src: ['lib/**/*.js'],
          options: {
            destination: 'doc'
          }
        }
      },
      clean: {
        doc: {
          src: ['doc']
        },
        dist: {
          src: ['js']
        },
        banner: {
          src: ['banner']
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    
    grunt.registerTask('test', ['jshint', 'nodeunit:module']);
    
    grunt.registerTask('distribute', ['clean:dist',
                                      'concat',
                                      'uglify',
                                      'nodeunit:min',
                                      'clean:banner']);

    grunt.registerTask('doc', ['clean:doc', 'jsdoc']);

    grunt.registerTask('default', ['test',
                                   'distribute',
                                   'doc']);

  };

  module.exports = grunt;

}());