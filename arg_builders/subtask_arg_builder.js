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

var _ = require('underscore');

/**
 * Helper Class to generate a well-formatted options hash for Subtask 
 * creation.
 */
var Subtask = function () {
  this.subtasks = {};
};

/**
 * Add another subtask. Argument[0] is the label, arguments[1..n] are the subtasks.
 * This must be called at least once, but can be called multiple times to add 
 * multiple label -> [subtask(s)] relationships.
 * param argument[0] {String} The label under which the subtask(s) is/are listed
 * param argument[1...n] {String} The name(s) of the subtask(s)
 */
Subtask.prototype.add_subtask = function (label) {
  if ((label === undefined) || (label && (typeof label) !== ('string'))) {
    throw new Error('Invalid label passed to add_subtask method.');
  }
  if (arguments.length === 1) {
    throw new Error('At least one subtask must be provided.');
  }
  var tasks = [];
  _.each(_.rest(arguments), function (argument) {
    if ((typeof argument) !== ('string')) {
      throw new Error('Invalid task provided. Task names must be strings.');
    }
    tasks.push(argument);
  });
  this.subtasks[label] = tasks;
  return this;
};


/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createSubTask API method.
 */
Subtask.prototype.to_options = function () {
  if (Object.keys(this.subtasks).length === 0) {
    throw new Error('At least one subtask is required.');
  }
  return this.subtasks;
};

exports.Subtask = new Subtask();