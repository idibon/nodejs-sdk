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
 * Helper Class to generate a well-formatted options hash for 
 * adding a tuning dictionary to a task.
 */
var TuningDictionary = function () {
  this.options = {};
};

/**
 * Add a new tuning dictionary to a task. This can be called multiple times
 * to generate more than one label->phrase->weight relationship, but it must
 * be called at least once to generate a proper options hash. All three arguments
 * are required.
 * param label {string} Label that this tuning dictionary will apply to
 * param phrase {string} This is the phrase that will be weighted differently
 * param weight {number} This is the weight that will be applied to the phrase
 */
TuningDictionary.prototype.add_dict = function (label, phrase, weight) {
  if ((label === undefined) || (phrase === undefined) || (weight === undefined)) {
    throw new Error('An undefined argument was passed to add_dict method.');
  }
  if (label && (typeof label) !== ('string')) {
    throw new Error('Invalid label passed to add_dict method.');
  }
  if (phrase && (typeof phrase) !== ('string') && !(phrase instanceof RegExp)) {
    throw new Error('Invalid phrase passed to add_dict method.');
  }
  if (weight && (typeof weight) !== ('number')) {
    throw new Error('Invalid weight passed to add_dict method.');
  }
  if ((weight < 0) || (weight > 1)) {
    throw new Error('Invalid weight. Value must be between 0 and 1');
  }

  //adjust phrase properly. If it's a string, leave it, if it's a regex,
  //convert it to java syntax so the API can read it.
  if (phrase instanceof RegExp) {
    //do conversion
    var modifier = ''
    var regexString = phrase.source;
    if (phrase.ignoreCase === true) {
      modifier = modifier + 'i';
    } 
    if (phrase.multiline === true) {
      modifier = modifier + 'm';
    }
    if (modifier) {
      regexString = '(?' + modifier + ')' + regexString;
    }
    phrase = regexString;
  }

  if (this.options[label] === undefined) {
    var weightedPhrase = {};
    weightedPhrase[phrase] = weight;
    this.options[label] = weightedPhrase;
  } else {
    this.options[label][phrase] = weight;
  }
  return this;
};

/**
 * Generates the final options hash. This should be called once after any other
 * methods in this class have been called. It will return a useable options hash
 * that can be properly passed into the setTuningDictionary API method.
 */
TuningDictionary.prototype.to_options = function () {
  if (Object.keys(this.options).length === 0) {
    throw new Error('At least one Label->Phrase->Weight relation must be defined.');
  }
  return this.options;
};

exports.TuningDictionary = new TuningDictionary();