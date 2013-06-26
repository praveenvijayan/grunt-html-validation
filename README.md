# grunt-html-validation

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

### Usage Examples

```js
validation: {
    options: {
        reset: grunt.option('reset') || false
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
_(Nothing yet)_
