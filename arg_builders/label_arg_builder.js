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
 * Helper Class to generate a well-formatted options has for label creation. 
 * This supports adding multiple labels at once
 */
var Label = function () {
  this.options = [];
};

/**
 * Adds a new label to the set of labels that will be added. Both arguments
 * are required. This method can be called multiple times to add multiple
 * labels, and it must be called at least once.
 * param name {String} Name of the new label
 * param description {String} Brief description of the new label
 */
Label.prototype.add_label = function (name, description) {
  if ((name === undefined) || (name && (typeof name) !== ('string'))) {
    throw new Error('Invalid name passed to add_label method.');
  }

  var newLabel = {};
  newLabel.name = name;

  if (description) {
    if ((typeof description) !== ('string')) {
      throw new Error('If description is provided then it must be a string');
    }
    newLabel.description = description;
  }

  this.options.push(newLabel);
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the addTaskLabels API method.
 */
Label.prototype.to_options = function () {
  if (this.options.length === 0) {
    throw new Error('At least one label must be provided.');
  }
  return this.options;
};


exports.Label = new Label();