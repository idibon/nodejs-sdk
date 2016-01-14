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
 * Creates a new subtask hierarchy by linking existing tasks to a label.
 * The relevant collection, task, label, and subtasks to be linked must alraedy
 * exist. Subtask hierarchies add a label -> [subtask1, subtask2, ..., subtask n]
 * relationship. This creates a tree-like structure where labels trigger their 
 * own set of subtasks beneath them. In this sample app we are creating a subtask 
 * structure with two subtasks, so one that looks like this label -> [subtask1, subtask2]. 
 * All arguments are passed in at the command line, and all are required for this sample
 * application. 
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name, the collection must exist
 * param argument[2] {String} Task name, the task must exist already.
 * param argument[3] {String} Label name, the task's label that will contain the subtasks
 * param argument[4] {String} Subtask one's name
 * param arugment[5] {String} Subtask two's name
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var Subtask = require('../../arg_builders/subtask_arg_builder.js').Subtask;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 8) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node createSubTask.js $API_KEY $COLLECTION_NAME $TASK_NAME $LABEL" +
    " $SUBTASK1 $SUBTASK2");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var taskName = process.argv[4];
var options = Subtask.
  add_subtask(process.argv[5], process.argv[6], process.argv[7]).
  to_options();

client.createSubTask(collectionName, taskName, options, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to add task labels: ", err);
  }
});