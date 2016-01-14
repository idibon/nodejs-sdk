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
 * Sample application for setting a confidence threshold.
 * The provided collection and task must already exist. All
 * arguments are passed in at the command line. All arguments are
 * required for this sample application.
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name, the collection must already exist
 * param argument[2] {String} Task name, the task must already exist
 * param argument[3] {String} Label that the threshold will be applied to
 * param argument[4] {Number} Threshold value, must be between 0 and 1.
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var ConfidenceThreshold = require('../../arg_builders/confidence_threshold_arg_builder.js').ConfidenceThreshold;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 7) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node setConfidenceThreshold.js $API_KEY $COLLECTION_NAME " +
    "$TASK_NAME $THRESHOLD_LABEL $THRESHOLD_VALUE");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var taskName = process.argv[4];
var options = ConfidenceThreshold.
  add_threshold(process.argv[5], Number(process.argv[6])).
  to_options();

client.setConfidenceThreshold(collectionName, taskName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to set task labels: ", err);
  }
});