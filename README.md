# grunt-html-validation [![Build Status](https://travis-ci.org/praveenvijayan/grunt-html-validation.png?branch=master)](https://travis-ci.org/praveenvijayan/grunt-html-validation)

[![NPM](https://nodei.co/npm/grunt-html-validation.png?downloads=true)](https://nodei.co/npm/grunt-html-validation/)

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
	validation: {
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
Type: `Boolean` <br/>
Default value: `'false'`

Resets all the validated  files status. When want to revalidate all the validated files - 
`eg: sudo grunt validate --reset=true`

#### options.path
Type: `String` <br/>
Default value: `'validation-status.json'`

Default file for storing validation information.

#### options.reportpath
Type: `String` <br/>
Default value: `validation-report.json`

Consolidated report in JSON format. 

#### options.stoponerror
Type: `Boolean` <br/>
Default value: `false`

When hit by a validation error, html-validator continue validating next file by default and this process continues until all files in the list completes validation. If 'stoponerror' set to  `true`, validator will stop validating next file.

#### options.maxTry
Type: `Number` <br/>
Default value: `3`

Number of retries when network error occuers. Default case, after 3 reties validator will move to next file.

#### options.remotePath
Type: `String` <br/>
Default value: ``

Remote base url path. eg: "http://decodize.com/". 


#### options.remoteFiles
Type: `Array` <br/>
Default value: ``

Array of page paths to be validated. When remote files are not present validator will append file names from local folder. 'remotePath' is mandatory when this option is specified. 

eg: remoteFiles: ["html/moving-from-wordpress-to-octopress/",
											"css/site-preloading-methods/"]

you can also provide a file contains array of pages.

remoteFiles: "validation-files.json"

```js
["html/getting-started-with-yeoman-1-dot-0-beta-on-windows",
"html/slidemote-universal-remote-control-for-html5-presentations/",
"html/simple-responsive-image-technique/"]
```

#### options.relaxerror
Type: `Array` <br/>
Default value: ``

Helps to skip certain w3c errors messages from validation. Give exact error message in an array & validator will ignore those relaxed errors from validation. 

```js
relaxerror: ["Bad value X-UA-Compatible for attribute http-equiv on element meta.","Element title must not be empty."]
```

#### options.validatorurl
Type: `String` <br/>
Default value: `null`

Allows you to set a different validator URL so that you can use a public mirror or an internal instance of the validator.
You must provide the URL for the actual validation page i.e. it needs to end in "/check".

If not set, defaults to http://validator.w3.org/check.

```js
validatorurl: "http://<your.validator.url>/check",
```

#### options.templates
Type: `Boolean` <br/>
Default value: `false`

Enables template processing. Templates are assumed to be fragments of potentially valid HTML without
&lt;head&gt; and &lt;body&gt; tags, in .html files. The validation process therefore wraps the template contents in the minimal boilerplate
header and footer code required to validate, writes the result to a temporary file and passes the file to the validator.

Example template:
```html
			<div>
				<span>Some content</span>
				...
			</div>
```

Wrapped template:
```html
<!DOCTYPE HTML>
<html>
	<head>
		<title>-</title>
	</head>
	<body>
		<div>
			<span>Some content</span>
			...
		</div>
	</body>
</html>
```

```js
templates: true
```

#### options.doctype
Type: `String` <br/>
Default value: `null`

Allows you to set the doctype to use when wrapping templates.

If not set, defaults to the HTML 5 doctype.

```js
doctype: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
```

### Usage Examples

```js
validation: {
		options: {
				reset: grunt.option('reset') || false,
				stoponerror: false,
				remotePath: "http://decodize.com/",
				remoteFiles: ["html/moving-from-wordpress-to-octopress/",
											"css/site-preloading-methods/"], //or
				remoteFiles: "validation-files.json", // JSON file contains array of page paths. 
				relaxerror: ["Bad value X-UA-Compatible for attribute http-equiv on element meta."] //ignores these errors
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

Report issues [here](https://github.com/praveenvijayan/grunt-html-validation/issues)

## Release History
 * 2013-08-31   v0.1.6   Added relaxed validation, w3cjs updated from 0.1.9 to 0.1.10.  
 * 2013-08-31   v0.1.5   Added remote validation support. Max network error retry count.  
 * 2013-08-19   v0.1.4   Fixed issues. Added 'stoponerror' option, validation report added. 
 * 2013-08-05   v0.1.2   Fixed issues.
 * 2013-04-20   v0.1.0   Initial release.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/praveenvijayan/grunt-html-validation/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

