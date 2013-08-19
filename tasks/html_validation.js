/*
 * grunt-html-validation
 * https://github.com/praveen/grunt-html-validation
 *
 * Copyright (c) 2013 praveenvijayan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var w3cjs = require('w3cjs');
	var colors = require('colors');
	var fs = require('fs');

	colors.setTheme({
		silly: 'rainbow',
		input: 'grey',
		verbose: 'cyan',
		prompt: 'grey',
		info: 'green',
		data: 'grey',
		help: 'cyan',
		warn: 'yellow',
		debug: 'blue',
		error: 'red',
		blue: 'blue'
	});

	var htmlContent = "",
		arryFile = [],
		counter = 0,
		msg = {
			error: "Something went wrong",
			ok: "Validation successful..",
			start: "Validation started for.. ",
			networkError: 'Network error re-validating..',
			validFile: "Validated skipping..",
			nofile: ":- No file is specified in the path!"
		},
		len,
		fileStat = {},
		isModified,
		fileCount = 0,
		validsettings = "",
		reportArry = [];

	grunt.registerMultiTask('validation', 'HTML W3C validation.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			path: "validation-status.json",
			reportpath: "validation-report.json",
			reset: false,
			stoponerror: false
		});

		var done = this.async(),
			files = grunt.file.expand(this.filesSrc),
			flen = files.length,
			readSettings = {};

		if (options.reset) {
			grunt.file.write(options.path, '{}');
		}

		if (!flen) {
			var nomsg = this.data.src;
			console.log(nomsg + msg.nofile.error);
		}

		var addToReport = function(fname, status) {
			var report = {};
			report.filename = fname;
			report.error = status;
			reportArry.push(report);
		};

		var validate = function(files) {

			if (files.length) {

				if (grunt.file.exists(options.path)) {
					readSettings = grunt.file.readJSON(options.path);
				}
				var currFileStat = readSettings[files[counter]] || false;

				if (currFileStat) {
					console.log(msg.validFile.green + files[counter]);
					addToReport(files[counter], false);
					counter++;
					validate(files);
					return;
				}

				if (files[counter] !== undefined) {
					console.log(msg.start + files[counter]);
				}

				var results = w3cjs.validate({
					file: files[counter], // file can either be a local file or a remote file
					//file: 'http://html5boilerplate.com/',
					output: 'json', // Defaults to 'json', other option includes html
					callback: function(res) {

						// var report = {};

						if (!res.messages) {
							console.log(msg.networkError.error);
							validate(files);
							return;
						}

						len = res.messages.length;

						if (len) {

							for (var prop in res.messages) {
								console.log(prop + "=> ".warn + JSON.stringify(res.messages[prop].message).help +
									" Line no: " + JSON.stringify(res.messages[prop].lastLine).prompt
								);
							}

							readSettings[files[counter]] = false;
							console.log("No of errors: ".error + res.messages.length);

							addToReport(files[counter], res.messages);

							if (options.stoponerror) {
								done();
								return;
							}

						} else {

							readSettings[files[counter]] = true;
							grunt.log.ok(msg.ok.green);

							addToReport(files[counter], false);

						}

						grunt.file.write(options.path, JSON.stringify(readSettings));
						// depending on the output type, res will either be a json object or a html string
						counter++;

						if (counter === flen) {

							grunt.file.write(options.reportpath, JSON.stringify(reportArry));
							console.log("Validation report generated: ".green + options.reportpath);
							done();
						}

						validate(files);
					}
				});
			}
		};

		validate(files);

	});

};