# grunt-html-validation [![Build Status](https://travis-ci.org/praveenvijayan/grunt-html-validation.png?branch=master)](https://travis-ci.org/praveenvijayan/grunt-html-validation)

> W3C html validaton grunt plugin. Validate all files in a directory automatically. 

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-validation --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-validation');
```

## The "html_validation" task

### Overview
In your project's Gruntfile, add a section named `html_validation` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  html_validation: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.reset
Type: `Boolean`
Default value: `'false'`

Resets all the validated  files status. When want to revalidate all the validated files - eg: sudo grunt validate --reset=true

#### options.path
Type: `String`
Default value: `'validation-staus.json'`

Default file for storing validation information.

#### options.reportpath
Type: `String`
Default value: `validation-report.json`

Consolidated report in JSON format. 

#### options.validation
Type: `Boolean`
Default value: `false`

When hit by a validation error, html-validator continue validating next file by default and this process continues until all files in the list completes validation. If 'toponerror' set to  `true`, validator will stop validating next file.

### Usage Examples

```js
validation: {
    options: {
        reset: grunt.option('reset') || false,
        toponerror: false
    },
    files: {
        src: ['<%= yeoman.app %>/*.html', 
            '!<%= yeoman.app %>/index.html', 
            '!<%= yeoman.app %>/modules.html',
            '!<%= yeoman.app %>/404.html']
    }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2013-08-19   v0.1.4   Fixed issues. Added 'stoponerror' option, validation report added. 
 * 2013-08-05   v0.1.2   Fixed issues.
 * 2013-04-20   v0.1.0   Initial release.
