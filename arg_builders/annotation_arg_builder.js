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
evil: false, vars: true, indent: 2*/


var _ = require('underscore');

/**
 * Helper Class to generate the options hash for annotation creation
 */
var Annotation = function () {
  this.provenance = null;
  this.confidence = null;
  this.reason = null;
  this.task = null;
  this.label = null;
  this.is_negated = null;
  this.status = null;
  this.is_trainable = null;
  this.length = null;
  this.text = null;
  this.offset = null;
  this.is_active = null;
};

/**
 * Specifies that the annotation was assigned by an expert human. 
 */
Annotation.prototype.human_assigned = function () {
  this.provenance = 'Human';
  return this;
};

/**
 * Specifies that the annotation was assigned by one or more
 * crowd-source workers
 */
Annotation.prototype.crowdsourced = function () {
  this.provenance = 'prediction';
  return this;
};

/**
 * Specifies that the annotation was bootstrapped using a 
 * dictionary string match or a similar method
 */
Annotation.prototype.bootstrapped = function () {
  this.provenance = 'bootstrapped';
  return this;
};

/**
 * Specify a confidence level for this annotation
 * @param confidence {Number} confidence of the annotation
 */
Annotation.prototype.with_confidence = function (confidence) {
  confidence = parseFloat(confidence); //returns NaN if something screwed up. 
  if ((typeof confidence !== 'number') || (confidence > 1) || (confidence < 0)) {
    throw new Error('Confidence should be a float between 0 and 1.');
  }
  this.confidence = confidence;
  return this;
};

/**
 * Specify a task for this annotation to be a part of.
 * It's REQUIRED that a task is specified or to_options will throw an error.
 * @param task {String} task name
 */
Annotation.prototype.with_task = function (task) {
  if ((task === undefined) || (typeof task !== 'string')) {
    throw new Error('Invalid task specified.');
  }
  this.task = task;
  return this;
};


/**
 * Specify a label for this annotation.
 * It's REQUIRED that a label is specified or to_options will throw an error.
 * @param task {String} Label name
 */
Annotation.prototype.with_label = function (label) {
  if ((label === undefined) || (typeof label !== 'string')) {
    throw new Error('Invalid label specified.');
  }
  this.label = label;
  return this;
};

/**
 * Specifies that an annotation is negated. Takes no argumnets
 */
Annotation.prototype.is_negative = function () {
  this.is_negated = true;
  return this;
};

/**
 * Specifies that an annotation is NOT negated.
 */
Annotation.prototype.is_positive = function () {
  this.is_negated = false;
  return this;
};


/**
 * Specifies an annotations status. The input must be one of:
 * 1) 'final'
 * 2) 'Gold'
 * 3) 'reviewed'
 * 4) 'assigned'
 * param status {String} Specifies the status. Must be one of the above.
 */
Annotation.prototype.with_status = function (status) {
  switch (status) {
  case 'final':
    this.status = 'final';
    this.is_trainable = true;
    break;
  case 'Gold':
    this.status = 'gold';
    this.is_trainable = true;
    break;
  case 'reviewed':
    this.status = 'reviewed';
    this.is_trainable = false;
    break;
  case 'assigned':
    this.status = 'assigned';
    this.is_trainable = false;
    break;
  default:
    throw new Error('Unknown status:', status);
  }
  return this;
};

/**
 * Specifies the length of the annotation. This is only relevant for a span task. 
 * If it IS a span task, then this methods MUST be called and MUST be used in
 * conjunction with the `with_offset` method.
 * param length {Number} Specifies the length.
 */
Annotation.prototype.with_length = function (length) {
  if ((length === undefined) || (typeof length !== 'number')) {
    throw new Error('Invald span length.');
  }
  this.length = length;
  return this;
};

/**
 * Specifies the offset of the annotation. This is only relevant for a span task. 
 * If it IS a span task, then this methods MUST be called and MUST be used in
 * conjunction with the `with_length` method.
 * param offset {Number} Specifies the offset.
 */
Annotation.prototype.with_offset = function (offset) {
  if ((offset === undefined) || (typeof offset !== 'number')) {
    throw new Error('Invald offset value.');
  }
  this.offset = offset;
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the createAnnotation API method.
 */
Annotation.prototype.to_options = function () {
  if ((this.label === null) || (this.task === null)) {
    throw new Error('An Annotation must minimally define label and task.');
  }
  if (((this.offset) && (!this.length)) || ((!this.offset) && (this.length))) {
    throw new Error('Span annotations must have both offset and length.');
  }
  var options = {};
  var item;

  for (item in this) {
    if (this.hasOwnProperty(item) && this[item]) {
      options[item] = this[item];
    }
  }
  return [options];
};

exports.Annotation = {
  for: function(task_name, label_name) {
    //wrap constructor so that it requires task_name and label_name.
    return new Annotation().with_task(task_name).with_label(label_name);
  }
};