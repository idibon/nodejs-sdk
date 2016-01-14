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
 * Helper Class to generate a well-formatted options hash for a new task
 */
var Task = function () {
  this.name = null;
  this.description = null;
  this.scope = null;
  this.is_active = null;
  this.trainable = null;
  this.config = {};
};

/**
 * Set the name of the new task. 
 * param name {String} name of the new task
 */
Task.prototype.with_name = function (name) {
  if ((name === undefined) || (name && (typeof name) !== ('string'))) {
    throw new Error('Invalid name passed to Task method "named".');
  }
  this.name = name;
  return this;
};

/**
 * Set the description of the new task. 
 * param description {String} description of the new task
 */
Task.prototype.with_description = function (description) {
  if ((description === undefined) || (description && (typeof description) !== ('string'))) {
    throw new Error('Invalid description passed to Task method "with_description".');
  }
  this.description = description;
  return this;
};

/**
 * Sets the task scope. Tasks are either `span` tasks or `document`
 * tasks. 
 * param scope {String} scope of the task
 */
Task.prototype.with_scope = function (scope) {
  if ((scope === undefined) || (scope && (typeof scope) !== ('string'))) {
    throw new Error('Invalid scope passed to Task method "with_scope".');
  }
  if ((scope !== 'document') && (scope !== 'span')) {
    throw new Error("Scope must either be 'span' or 'document'.");
  }
  this.scope = scope;
  return this;
};


/**
 * Sets the task to activate. 
 */
Task.prototype.is_activated = function () {
  this.is_active = true;
  return this;
};

/**
 * Sets the task to inactivate. 
 */
Task.prototype.is_not_activated = function () {
  this.is_active = false;
  return this;
};

/**
 * Sets the task to trainable. 
 */
Task.prototype.trainable = function () {
  this.is_trainable = true;
  return this;
};

/**
 * Sets the task to not trainable. 
 */
Task.prototype.not_trainable = function () {
  this.is_trainable = false;
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createTask API method.
 */
Task.prototype.to_options = function () {
  if ((this.name === null) || (this.description === null) || (this.scope === null)) {
    throw new Error('Task must minimally define "name", "description", and "scope".');
  }
  var options = {};
  var item;

  for (item in this) {
    if (this.hasOwnProperty(item) && (this[item])) {
      options[item] = this[item];
    }
  }
  options.config = {};
  return options;
};

exports.Task = {
  for: function(name, description, scope) {
    //wrap constructor so that it requires name, description, and scope.
    return new Task().
      with_name(name).
      with_description(description).
      with_scope(scope);
  }
};