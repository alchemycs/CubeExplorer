/* jshint node:true */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        jshint:{
            options:{
                unused:true,
                bitwise:true,
                curly:true,
                eqeqeq:true,
                forin:true,
                noarg:true,
                noempty:true,
                nonew:true,
                undef:true,
                strict:true,
                devel:true
            },
            grunt:{
                src:['Gruntfile.js']
            },
            application:{
                options:{
                    globals:{
                        define:false,
                        require:false
                    }
                },
                src:['public/js/**/*.js', '!public/js/vendor/**/*.js']
            },
            server:{
                src:[
                    'app.js',
                    'routes/**/*.js',
                    'config/**/*.js'
                ]
            }
        },
        recess:{
            options:{
                noOverqualifying:false
            },
            lint:{
                src:['public/css/style.css']
            }
        },
        requirejs:{
            build:{
                options:{
                    preserveLicenseComments:false,
                    optimizeCss:'standard', //Check with IE, could break
                    appDir:'public/',
                    baseUrl:'./js',
                    dir:'public-build',
//                    keepBuildDir:true,
                    module:{ //check this first - something about deleting
                        name:'main'
                    }
                }
            }
        },
        clean:{
            build:[ 'public-build' ]
        },
        htmlmin:{
            build:{
                options:{
                    removeComments:true,
                    collapseWhitespace:true
                },
                files:{
                    'public-build/index.html':'public/index.html',
                    'public-build/partials/404.html':'public/partials/404.html',
                    'public-build/partials/index.html':'public/partials/index.html'

                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.registerTask('lint', ['recess', 'jshint']);
    grunt.registerTask('default', ['lint']);
    grunt.registerTask('build', ['lint', 'requirejs:build']);
    grunt.registerTask('build:full', ['lint', 'requirejs:build', 'htmlmin']);
};