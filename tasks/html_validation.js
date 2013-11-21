/*
 * grunt-html-validation
 * https://github.com/praveen/grunt-html-validation
 *
 * Copyright (c) 2013 Praveen Vijayan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var w3cjs = require('w3cjs');
	var colors = require('colors');
	var path = require('path');
	var rval = require('../lib/remoteval');

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

	var counter = 0,
		msg = {
			error: "Something went wrong",
			ok: "Validation successful..",
			start: "Validation started for.. ".info,
			networkError: 'Network error re-validating..'.error,
			validFile: "Validated skipping..",
			nofile: ":- No file is specified in the path!",
			nextfile: "Skipping to the next file..".verbose,
			eof: "End of File..".verbose,
			fileNotFound: "File not found..".error,
			remotePathError: "Remote path ".error + "(options->remotePath) ".grey + "is mandatory when remote files ".error+"(options-> remoteFiles) ".grey+"are specified!".error,
			temp: "Using temp file: ".info
		},
		len,
		reportArry =[],
		retryCount = 0,
		reportFilename = "";

	grunt.registerMultiTask('validation', 'HTML W3C validation.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			path: "validation-status.json",
			reportpath: "validation-report.json",
			reset: false,
			stoponerror: false,
			remotePath: false,
			maxTry: 3,
			relaxerror:[],
			templates: false
		});

		var done = this.async(),
			files = grunt.file.expand(this.filesSrc),
			flen = files.length,
			readSettings = {},
			isRelaxError = false;

		isRelaxError = options.relaxerror.length && options.relaxerror.length !== '';

		
		var makeFileList  = function (files) {
			return files.map(function(file) {
				return options.remotePath + file;
			});
		};

		var filenames = [];	// Stores the original names when temp files are used for templates.

		//Reset current validation status and start from scratch.
		if (options.reset) {
			grunt.file.write(options.path, '{}');
		}

		if (!flen) {
			var nomsg = this.data.src;
			console.log(nomsg + msg.nofile.error);
		}

		var addToReport = function(fname, status) {
			var relaxedReport = [];

			for (var i = 0; i < status.length; i++) {
				if (!checkRelaxError(status[i].message)) {
					relaxedReport.push(status[i]);
				}
			}

			var report = {};
			report.filename = fname;
			report.error = relaxedReport;
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
					reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
					addToReport(reportFilename, false);
					counter++;
					validate(files);
					return;
				}

				if (files[counter] !== undefined) {

					var filename = options.remoteFiles ? dummyFile[counter] : files[counter];

					if (options.templates) {
						console.log(msg.start + filenames[counter]);
						console.log(msg.temp + filename);
					}
					else{
						console.log(msg.start + filename);
					}
				}

				w3cjs.validate({
					file: files[counter], // file can either be a local file or a remote file
					// file: 'http://localhost:9001/010_gul006_business_landing_o2_v11.html',
					output: 'json', // Defaults to 'json', other option includes html
					callback: function(res) {

						// console.log(res)

						flen = files.length;

						if (!res.messages) {
							++retryCount;
							var netErrorMsg = msg.networkError +  " " + retryCount.toString().error +" ";
							if (retryCount === options.maxTry) {
								counter++;
								if (counter !==flen) {
									netErrorMsg += msg.nextfile;
								}else{
									netErrorMsg += msg.eof;
								}
								retryCount = 0;
							}
						
							console.log(netErrorMsg);
							validate(files);
							deleteTmpFiles();
							return;
						}

						len = res.messages.length;

						if (len) {
							var errorCount = 0;
							var chkRelaxError;

							for (var prop in res.messages) {
								if (isRelaxError) {
									chkRelaxError = checkRelaxError(res.messages[prop].message);
								}

								if (!chkRelaxError) {
									errorCount = errorCount+1;
									console.log(errorCount + "=> ".warn + JSON.stringify(res.messages[prop].message).help +
										" Line no: " + 
										// If we're validating templates, adjust the line no. to allow for the 
										// header boilerplate.
										(options.templates ? JSON.stringify(res.messages[prop].lastLine - 6).prompt
											: JSON.stringify(res.messages[prop].lastLine).prompt)
									);
								}
								
							}



							if (errorCount !== 0) {
								console.log("No of errors: ".error + errorCount);
							}
							
							readSettings[files[counter]] = false;
							reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
							addToReport(reportFilename, res.messages);

							if (options.stoponerror) {
								deleteTmpFiles();
								done();
								return;
							}

							if (isRelaxError && errorCount === 0) {
								setGreen();
							}


						} else {

							setGreen();

						}

						function setGreen () {
							readSettings[files[counter]] = true;
							grunt.log.ok(msg.ok.green);

							reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
							addToReport(reportFilename, false);
						}

						grunt.file.write(options.path, JSON.stringify(readSettings));
						// depending on the output type, res will either be a json object or a html string
						counter++;

						if (counter === flen) {
							grunt.file.write(options.reportpath, JSON.stringify(reportArry));
							console.log("Validation report generated: ".green + options.reportpath);
							
							deleteTmpFiles();
							done();
						}

						if (options.remoteFiles) {
							if (counter === flen) return;

							rval (dummyFile[counter], function() {
								validate(files);
							});

						}else{
							validate(files);
						}
					}
				});
			}
		};

		function checkRelaxError (error) {
			if (options.relaxerror.indexOf(error) >= 0) {
				return true;
			}
		}
		
		// TEMPORARY SOLUTION UNTIL tmp CAN DELETE FILES ON CTRL-C... OR AT ALL.
		function deleteTmpFiles () {
			// Delete the temp files after validating templates.
			if (options.templates) {
				for (var i = 0;i < tplFiles.length;i++) {
					if (grunt.file.exists(tplFiles[i])) {
						grunt.file.delete(tplFiles[i], {force: true});
					}
				}
			}
		}

		/*Remote validation 
		*Note on Remote validation.
		* W3Cjs supports remote file validation but due to some reasons it is not working as expected. Local file validation is working perfectly. To overcome this remote page is fetch using 'request' npm module and write page content in '_tempvlidation.html' file and validates as local file. 
		*/

		if (!options.remotePath && options.remoteFiles) {
			console.log(msg.remotePathError);
			return;
		}

		if (options.remotePath && options.remotePath !== "") {
			files = makeFileList(files);
		}

		if (options.remoteFiles) {

			if (typeof options.remoteFiles === 'object' && options.remoteFiles.length && options.remoteFiles[0] !=='' ) {
				files = options.remoteFiles;
				
			}else{
				files = grunt.file.readJSON(options.remoteFiles);
			}	

			files = makeFileList(files);

			var dummyFile = files;

			files = [];

			for (var i = 0; i < dummyFile.length; i++) {
				files.push('_tempvlidation.html');
			}

			rval (dummyFile[counter], function() {
				validate(files);
			});

			return;
		}

		if (options.templates) {
			// Process HTML templates. Assumes that templates are fragments of potentially valid HTML without
			// <head> and <body> tags. Therefore wraps the template contents in the minimal boilerplate
			// header and footer required to validate.

			var HTML5Header = "<!DOCTYPE HTML>\n<html>\n\t<head>\n\t\t<title>-</title>\n\t</head>\n\t<body>\n";
			var HTML5Footer = "\n\t</body>\n</html>";
			var tplFiles = [];
			var responses = [];
			
			var tmp = require('tmp');
			tmp.setGracefulCleanup();
			
			// Create a temp file for each template and valiate that. Temp files are created asynchronously
			// so call val() to check the response state of each call and wait until all callbacks have returned.
			for (var j = 0;j < files.length;j++) {
				// Wrap the asynch. call in a function and pass the counter in to avoid the
				// context changing before the call is made, causing the counter to change.
				(function(j) {
					tmp.tmpName({ postfix: '.html' }, function _tempNameGenerated(err, path) {
						if (err) throw err;
						var content = grunt.file.read(files[j]);
						grunt.file.write(path, HTML5Header + content + HTML5Footer);
						tplFiles[j] = path;
						responses[j] = true;
						val();
					});
				})(j);
				filenames[j] = path.basename(files[j]);
			}

			// This function checks the response array and runs validation once all
			// temp files are ready.
			var val = function () {
				if (tplFiles.length == files.length) {
					validate(tplFiles);
				}
			};

			return;
		}

		if (!options.remoteFiles) {
			validate(files);
		}


	});

};