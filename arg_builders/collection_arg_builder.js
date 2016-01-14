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
 * Helper Class to generate dictionary parameters for collection creation 
 */
var Collection = function () {
  this.name = null;
  this.description = null;
  this.is_active = null;
  this.tasks = null;
};

/**
 * Set the name of the new Collection. This method is required.
 * param name {String} Name of the new collection
 */
Collection.prototype.with_name = function (name) {
  if ((name === undefined) || (name && (typeof name) !== ('string'))) {
    throw new Error('Invalid name passed to Collection method with_name.');
  }
  this.name = name;
  return this;
};

/**
 * Set the Collection description. This method is required.
 * param description {String} A description of the new collection
 */
Collection.prototype.with_description = function (description) {
  if ((description === undefined) || (description && (typeof description) !== ('string'))) {
    throw new Error('Invalid description passed to Collection method "with_description".');
  }
  this.description = description;
  return this;
};

/**
 * Set the collection as active.
 */
Collection.prototype.set_as_active = function () {
  this.is_active = true;
  return this;
};

/**
 * Set the collection as inactive.
 */
Collection.prototype.set_as_not_active = function () {
  this.is_active = false;
  return this;
};

/**
 * Adds tasks to a collection. This doesn't have to be done at
 * creation -- tasks can be added to a collection at any time.
 * param tasks {Object} Takes a task object or an array of task objects. 
 * See the task_arg_builder for more information on generating 
 * option hashes for tasks.
 */
Collection.prototype.with_tasks = function (tasks) {
  if ((tasks === undefined) || (tasks && (typeof tasks) !== ('object'))) {
    throw new Error('Invalid tasks passed to Collection method "with_tasks".');
  }
  //If tasks was not passed in as an array, convert it.
  if (!(tasks instanceof Array)) {
    tasks = [tasks];
  }
  this.tasks = tasks;
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createCollection or updateCollection API 
 * methods.
 */
Collection.prototype.to_options = function () {
  if ((this.name === null) || (this.description === null)) {
    throw new Error('An Annotation must minimally define name and description.');
  }

  var options = {};
  var item;
  for (item in this) {
    if (this.hasOwnProperty(item) && (this[item])) {
      options[item] = this[item];
    }
  }
  return options;
};

exports.Collection = {
  for: function(name, description) {
    //wrap constructor so that it requires name and description.
    return new Collection().with_name(name).with_description(description);
  }
};