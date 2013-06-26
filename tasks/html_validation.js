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
    error: 'red'
  });

  var htmlContent = "",
  arryFile=[],
  counter = 0,
  msg={
    error: "Something went wrong",
    ok: "Validation successful..",
    start: "Validation started for.. ",
    networkError: 'Network error re-validating..',
    validFile:"Validated skipping.."
  },
  len,
  fileStat = {},
  isModified,
  fileCount = 0,
  validsettings="";
  
  grunt.registerMultiTask('validation', 'HTML W3C validation.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      path: "validation-staus.json",
      reset:false
    });
    
    var done = this.async(),
    files = grunt.file.expand(this.filesSrc),
    flen = files.length,
    readSettings = {};

    if(options.reset){
      grunt.file.write(options.path, '{}');
    }

    var validate = function (files) {
      if(files.length){
        if(grunt.file.exists(options.path)){
          readSettings = grunt.file.readJSON(options.path);
        }
        var currFileStat = readSettings[files[counter]] || false;

        if(currFileStat){
          console.log(msg.validFile.green + files[counter]);
          counter++;
          validate(files);
          return;
        }

        console.log(msg.start+files[counter]);

        var results = w3cjs.validate({
                      file: files[counter], // file can either be a local file or a remote file
                      //file: 'http://html5boilerplate.com/',
                      output: 'json', // Defaults to 'json', other option includes html
                      callback: function (res) {

                        if(!res.messages){
                          console.log(msg.networkError.error)
                          validate(files);
                          return;
                        }

                        len = res.messages.length;

                        if(len){

                          for(var prop in res.messages){
                            console.log(prop + "=> ".warn +JSON.stringify(res.messages[prop].message).help + 
                              " Line no: " + JSON.stringify(res.messages[prop].lastLine).prompt
                              );
                          }

                          readSettings[files[counter]] = false;
                          console.log("No of errors: ".error + res.messages.length);

                        }else{

                          readSettings[files[counter]] = true;
                          grunt.log.ok(msg.ok.green);

                        }

                        grunt.file.write(options.path, JSON.stringify(readSettings));

                          // depending on the output type, res will either be a json object or a html string
                          // console.log(arryFile);
                          counter++;
                          if(counter === flen-1){
                            done();
                          }
                          validate(files);
                        }
                      });          
}
}

validate(files);

});

};
