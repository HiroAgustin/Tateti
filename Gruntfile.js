'use strict';

module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            ,   files: ['index.html']
            }
        }
    ,   connect: {
            options: {
                port: 9000
            ,   livereload: 35729
            ,   hostname: '0.0.0.0'
            }
        ,   livereload: {
                options: {
                    open: true
                }
            }
        }
    });

    grunt.registerTask('default', ['connect', 'watch']);
};