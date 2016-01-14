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

/** 
 * Sample application for setting a tuning dictionary to a task.
 * A tuning dictionary creates a label->phrase->weight relationship, where
 * if a certain Phrase is found, then the Label will be more differently Weighted.
 * The provided collection and task must already exist. All
 * arguments are passed in at the command line. All arguments are
 * required for this sample application.
 * param argument[2] {String} API key
 * param argument[3] {String} Collection name, the collection must already exist
 * param argument[4] {String} Task name, the task must already exist
 * param argument[5] {String} Name of the label that will be weighted
 * param argument[6] {RegExp} Phrase that will cause the weighting
 * param argument[7] {Number} Weight, between 0 and 1, that will be applied 
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var TuningDictionary = require('../../arg_builders/tuning_dictionary_arg_builder.js').TuningDictionary;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 8) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node .Dictionary.js $API_KEY $COLLECTION_NAME " +
    "$TASK_NAME $LABEL $PHRASE $WEIGHT");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var taskName = process.argv[4];
var label = process.argv[5];
var phrase = process.argv[6];
var weight = Number(process.argv[7]);

try {
  phrase = eval(phrase); //eval is evil. Consider changing.
  if (!(phrase instanceof RegExp)) {
    throw new Error("Not a regexp.");
  }
} catch (ignore) {
  //Invalid command line regex. Phrase will be treated as a string
}

var options = TuningDictionary.
  add_dict(label, phrase, weight).
  to_options();

client.setTuningDictionary(collectionName, taskName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to add task labels: ", err);
  }
});
