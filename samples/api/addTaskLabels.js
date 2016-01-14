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
 * Sample application for adding a label to a task.
 * The provided collection and task must already exist. All
 * arguments are passed in at the command line. All arguments are
 * required for this sample application.
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name, the collection must already exist
 * param argument[2] {String} Task name, the task must already exist
 * param argument[3] {String} New label's name
 * param argument[4] {String} New label's description
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var Label = require('../../arg_builders/label_arg_builder.js').Label;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 7) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node addTaskLabels.js $API_KEY $COLLECTION_NAME " +
    "$TASK_NAME $LABEL_NAME $LABEL_DESCRIPTION");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var taskName = process.argv[4];
var options = Label.
  add_label(process.argv[5], process.argv[6]).
  to_options();

client.addTaskLabels(collectionName, taskName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to add task labels: ", err);
  }
});
