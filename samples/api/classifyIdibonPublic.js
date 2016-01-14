'use strict';

/**
 * @copyright
 * Copyright 2015 Idibon
 *
 * @license
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*jslint nomen: true, debug: true,
evil: false, vars: true, indent: 2 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var Classification = require('../../arg_builders/classification_arg_builder.js').Classification;

/** 
 * Sample application for using Idibon Public to generate a 
 * classification on new content. Idibon Public must be running locally.
 * This example uses Idibon Public's EnglishSocialSentiment
 * task to generate the classificaion.
 * param argument[0] {String} Content to be classified
 */

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 3) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node classifyIdibonPublic.js $CONTENT");
}

var client = new IdibonAPIClient('NO_API_KEY_NEEDED', 'http://localhost:8080/');

var collectionName = 'Idibon';
var taskName = 'EnglishSocialSentiment';
var options = Classification.
  with_content(process.argv[2]).
  to_options();

client.createClassification(collectionName, taskName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response:", resp);
  } else {
    console.log("Failed to create classification: ", err);
  }
});
