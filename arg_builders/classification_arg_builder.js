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
 * Helper Class to generate dictionary parameters for Classification creation
 */
var Classification = function () {
  this.document = null;
  this.content = null;
};

/**
 * Specify a document on which to generate a classification.
 * Either a document or new, unstored content must be provided. So if this method
 * is not called, then `with_content` must be used.
 * param documentName {String} Name of the document that should be classified
 */
Classification.prototype.with_document = function (documentName) {
  if ((documentName === undefined) || ((typeof documentName) !== ('string'))) {
    throw new Error('Invalid document name.');
  }
  this.document = documentName;
  this.content = null; //can only be one or the other.
  return this;
};

/**
 * Provide fetch content on which to generate a classification.
 * Either a document or new, unstored content must be provided. So if this method
 * is not called, then `with_document` must be used.
 * param content {String} Text content to be classified
 */
Classification.prototype.with_content = function (content) {
  if ((content === undefined) || ((typeof content) !== ('string'))) {
    throw new Error('Invalid content passed to Classification "with_content" function.');
  }
  this.content = content;
  this.document = null; //can only be one or the other.
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createClassification API method.
 */
Classification.prototype.to_options = function () {
  var options = {};
  if (this.document !== null) {
    options.document = this.document;
  } else if (this.content !== null) {
    options.content = this.content;
  } else {
    throw new Error('Classification must define either document or content.');
  }
  return options;
};

exports.Classification = new Classification();