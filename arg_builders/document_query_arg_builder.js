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
 * Helper Class to generate a well-formatted options hash for document retrieval.
 * This will be passed into the `fetchDocuments` method to provide more customization
 * as to what results are returned.
 */
var DocumentQuery = function () {
  this.start = null;
  this.count = null;
  this.stream = false;
  this.sort = null; //create_at, updated_at, annotated_at
  this.order = null; //asc, desc
  this.before = null;
  this.after = null;
  this.task = null;
  this.label = null;
  this.content = null;
};

/**
 * Set the start value. This defaults to zero, but other values can be provided. It 
 * determines the index of the first document to be returned in each page. Setting it
 * to something other than zero will limit the number of documents returned.
 * param start {Number} starting index 
 */
DocumentQuery.prototype.with_start = function (start) {
  if ((start === undefined) || (start && (typeof start) !== ('number')) || (start < 0)) {
    throw new Error('Invalid start value passed to document_query.');
  }
  this.start = start;
  return this;
};

/**
 * Set the count value. This determines the number of documents fetched with 
 * each API call. It defaults to a thousand, and cannot be more than that. 
 * param count {Number} count value
 */
DocumentQuery.prototype.with_count = function (count) {
  if ((count === undefined) || (count && (typeof count) !== ('number')) || (count < 0)) {
    throw new Error('Invalid count value passed to document_query.');
  }
  this.count = count;
  return this;
};

/**
 * Sets the return to be in streaming mode. This means only the document name and 
 * created_at date will be returned. If this is not set, then full results will 
 * be returned for each document.
 */
DocumentQuery.prototype.in_stream_mode = function () {
  this.stream = true;
  this.full = true;
  return this;
};

/**
 * Sets the options such that the documents are sorted by their created_at dates.
 */
DocumentQuery.prototype.sort_by_creation = function () {
  this.sort = 'created_at';
  return this;
};

/**
 * Sets the options such that the documents are sorted by their updated_at dates.
 */
DocumentQuery.prototype.sort_by_update = function () {
  this.sort = 'updated_at';
  return this;
};

/**
 * Sets the options such that the documents are sorted by their annotated_at dates.
 */
DocumentQuery.prototype.sort_by_annotation = function () {
  this.sort = 'annotated_at';
  return this;
};

/**
 * Sets the options such that the documents are sorted in ascending order.
 */
DocumentQuery.prototype.in_ascending_order = function () {
  this.order = 'asc';
  return this;
};

/**
 * Sets the options such that the documents are sorted in descending order.
 */
DocumentQuery.prototype.in_descending_order = function () {
  this.order = 'desc';
  return this;
};

/**
 * This method filters the response down to documents associated with a certain
 * task.
 * param task {string} Name of the task
 */
DocumentQuery.prototype.with_task = function (task) {
  if ((task === undefined) || (task && (typeof task) !== ('string'))) {
    throw new Error('Invalid task passed to document_query.');
  }
  this.task = task;
  return this;
};

/**
 * This method filters the response down to documents that have been updated after
 * a certain date
 * param after {number} date
 */
DocumentQuery.prototype.updated_after = function (after) {
  if ((after === undefined) || (after && !(after instanceof Date))) {
    throw new Error('Invalid time passed to document_query.');
  }
  this.after = after;
  return this;
};

/**
 * This method filters the response down to documents that have been updated before
 * a certain date
 * param before {number} date
 */
DocumentQuery.prototype.updated_before = function (before) {

  if ((before === undefined) || (before && !(before instanceof Date))) {
    throw new Error('Invalid time passed to document_query.');
  }
  this.before = before;
  return this;
};


/**
 * This method filters the response down to documents that contain a provided text
 * snippet in their content.
 * param content {number} content that must match for the document to be returned
 */
DocumentQuery.prototype.with_content = function (content) {
  if ((content === undefined) || (content && (typeof content) !== ('string'))) {
    throw new Error('Invalid content passed to document_query.');
  }
  this.content = content;
  return this;
};


/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the fetchDocuments API method.
 */
DocumentQuery.prototype.to_options = function () {
  if ((this.task === null) && (this.label !== null)) {
    throw new Error('A task MUST be provided if a label is provided.');
  }
  if ((this.after && this.before) && (this.after < this.before)) {
    throw new Error('The "before" time must be earlier than the "after" time');
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

exports.DocumentQuery = new DocumentQuery();