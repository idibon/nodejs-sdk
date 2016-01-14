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
 * Helper Class to generate a well-formatted option hash
 * for ConfidenceThreshold creation and updating
 */
var ConfidenceThreshold = function () {
  this.options = {};
};

/**
 * Add a confidence threshold. This can be called multiple times to create
 * more than one confidence threshold (different threshold for different labels).
 * This method must be called at least once to generate a valid options hash.
 * param label {String} Relevant label that the threshold will be on
 * param threshold {Number} Threshold value
 */
ConfidenceThreshold.prototype.add_threshold = function (label, threshold) {
  if ((label === undefined) || (label && (typeof label) !== ('string'))) {
    throw new Error('Invalid label passed to add_threshold method.');
  }
  if ((threshold === undefined) || (threshold && (typeof threshold) !== ('number'))) {
    throw new Error('Invalid threshold passed to add_threshold method. Threshold must be a value between 0 and 1.');
  }
  if ((threshold < 0) || (threshold > 1)) {
    throw new Error('Invalid threshold. Value must be between 0 and 1');
  }

  this.options[label] = {'suggested': threshold};
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the setConfidenceThreshold API method.
 */
ConfidenceThreshold.prototype.to_options = function () {
  if (!this.options) {
    throw new Error('At least one threshold must be provided.');
  }
  return this.options;
};

exports.ConfidenceThreshold = new ConfidenceThreshold();