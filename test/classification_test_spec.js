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

/*global describe, it*/
/*jslint nomen: true, debug: true,
evil: false, vars: true, indent: 2, regexp: true*/

var IdibonAPIClient = require('../lib/idibon.js').IdibonAPIClient;
var request = require('request');
var _ = require('underscore');
var assert = require('assert');
var nock = require('nock');
var util = require('util');
var faker = require('faker');
var Classification = require('../arg_builders/classification_arg_builder.js').Classification;

var apiKey = "MY API KEY";
var client = new IdibonAPIClient(apiKey);

describe('Create classifications', function () {
  it('should create a classification for a document', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var taskName = 'test-task-' + faker.lorem.words()[0];
    var expectedResponse = {
      "prediction": faker.lorem.words()[0],
      "confidence": faker.lorem.words()[0]
    };

    var options = Classification.
      with_document('test-document-' + faker.lorem.words()[0]).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .get('/' + collectionName + '/' + taskName)
      .reply(200, expectedResponse);

    client.createClassification(collectionName, taskName, options, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should create a prediction for unstored content', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var taskName = 'test-task-' + faker.lorem.words()[0];
    var expectedResponse = {
      "prediction": faker.lorem.words()[0],
      "confidence": faker.lorem.words()[0]
    };
    var options = Classification.
      with_content(faker.lorem.sentence()[0]).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .get('/' + collectionName + '/' + taskName)
      .reply(200, expectedResponse);

    client.createClassification(collectionName, taskName, options, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });
});
