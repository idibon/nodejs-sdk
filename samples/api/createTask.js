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
 * Creates a new task. The relevant collection must already exist. In this sample
 * app we are creating a document task with a name and description. All arguments 
 * are passed in at the command line, and all are required for this sample application. 
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name, the collection must exist
 * param argument[2] {String} The name of the new task
 * param argument[3] {String} Task description
 * param argument[4] {String} Scope of the task. Must be either 'document' or 'span'
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var Task = require('../../arg_builders/task_arg_builder.js').Task;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 7) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node createTask.js $API_KEY $COLLECTION_NAME $TASK_NAME " +
    "$DESCRIPTION $SCOPE");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var options = Task.for(process.argv[4], process.argv[5], process.argv[6]).
  to_options();

client.createTask(collectionName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to create a task: ", err);
  }
});
