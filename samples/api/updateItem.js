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
 * Updates a collection's description, a task's description or name, or a label's name.
 * Run node updateItem.js --help for full option details.
 */

var stdio = require('stdio');
var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;

var ops = stdio.getopt({
  apiKey: {description: 'API key', args: 1, key: 'k', mandatory: true},
  collection: {description: 'Relevant Collection', args: 1, key: 'c', mandatory: true},
  task: {description: 'Relevant Task. Must be present to update task or label.',
    args: 1, key: 't', mandatory: false},
  label: {description: 'Relevant Label. Must be present to update label.',
    args: 1, key: 'l', mandatory: false},
  newDescription: {description: 'A new description. One of -d or -n is required.',
    key: 'd', args: 1, mandatory: false},
  newName: {description: 'A new name. One of -d or -n is required.',
    key: 'n', args: 1, mandatory: false}
});

//create the client object with the provided api key.
var client = new IdibonAPIClient(ops.apiKey);

if (ops.collection && !ops.task && !ops.label && ops.newDescription && !ops.newName) {
  //updating a collection with a new description
  client.updateCollection(ops.collection, ops.newDescription, function (err, resp) {
    if (!err && resp) {
      console.log("Response: ", resp);
      process.exit(0);
    } else {
      console.log("Failed to update the collection: ", err);
      process.exit(1);
    }
  });
} else if (ops.collection && ops.task && !ops.label && (ops.newDescription || ops.newName)) {
  //updating a task with a new description, a new name, or both.
  var options = {};
  if (ops.newName) {
    options["name"] = ops.newName;
  }
  if (ops.newDescription) {
    options["description"] = ops.newDescription;
  }

  client.updateTask(ops.collection, ops.task, options, function (err, resp) {
    if (!err && resp) {
      console.log("Response: ", resp);
      process.exit(0);
    } else {
      console.log("Failed to update the collection: ", err);
      process.exit(1);
    }
  });
} else if (ops.collection && ops.task && ops.label && ops.newName && !ops.newDescription) {
  //rename the label
  client.renameLabel(ops.collection, ops.task, ops.label, ops.newName, function (err, resp) {
    if (!err && resp) {
      console.log("Response: ", resp);
    } else {
      console.log("Failed to rename label: ", err);
    }
  });
} else {
  //no valid argument combination was given. 
  console.log("Improper combination of command line inputs was provided. Please either: ");
  console.log("1) Provide a collection and a new description to update the collection description.");
  console.log("2) Provide a collection, a task, and a new name and/or description to update the task.");
  console.log("3) Provide a collection, task, label, and new label name to update a label name.");
}