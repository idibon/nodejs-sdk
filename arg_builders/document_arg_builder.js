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
 * Helper Class to generate a well-formatted options hash for document 
 * creation. Note that this is for uploading a single document using the
 * createDocument method. We recommend that you upload documents in bulk
 * using the createDocuments method which accepts a new-line delimited series
 * of JSON files containing name, content, and metadata fields.
 */
var Document = function () {
  this.name = null;
  this.content = null;
  this.metadata = null;
  this.annotations = null;
  this.title = null;
};

/**
 * Set the document name.
 * param name {String} The name of the new document.
 */
Document.prototype.with_name = function (name) {
  if ((name === undefined) || (name && (typeof name) !== ('string'))) {
    throw new Error('Invalid name passed to Document method "named".');
  }
  this.name = name;
  return this;
};

/**
 * Set the document content. This is the only required method.
 * param content {String} The content of the new document.
 */
Document.prototype.with_content = function (content) {
  if ((content === undefined) || (content && (typeof content) !== ('string'))) {
    throw new Error('Invalid content passed to Document method "with_content".');
  }
  this.content = content;
  return this;
};

/**
 * Set the document metadata. This could include twitter headers, dates, source, etc.
 * param metadata {Object} Any metadata associated with the document.
 */
Document.prototype.with_metadata = function (metadata) {
  if ((metadata === undefined) || (metadata && (typeof metadata) !== ('object'))) {
    throw new Error('Invalid metadata passed to Document method "with_metadata".');
  }
  this.metadata = metadata;
  return this;
};

/**
 * Add any annotations. Normally, these are added later to existing documents, but they
 * can also be created at the time the document is uploaded. See the annotation_arg_builder 
 * file for information on how to generate appropriate annotation hashes. 
 * param annotations {Object} An annotation object, or an array of annotation objects.
 */
Document.prototype.with_annotations = function (annotations) {
  if ((annotations === undefined) || (annotations && (typeof annotations) !== ('object'))) {
    throw new Error('Invalid annotations passed to Document method "with_annotations".');
  }
  //If annotations was not passed in as an array, convert it.
  if (!(annotations instanceof Array)) {
    annotations = [annotations];
  }
  this.annotations = annotations;
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createDocument API method.
 */
Document.prototype.to_options = function () {
  if (this.content === null) {
    throw new Error('Document must minimally define "content".');
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

exports.Document = {
  for: function(content) {
    //wrap constructor so that it requires content.
    return new Document().with_content(content);
  }
};