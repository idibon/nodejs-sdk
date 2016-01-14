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
var Annotation = require('../arg_builders/annotation_arg_builder.js').Annotation;
var DocumentQuery = require('../arg_builders/document_query_arg_builder.js').DocumentQuery;

var apiKey = "MY_API_KEY";
var client = new IdibonAPIClient(apiKey);

describe('create and delete annotations', function () {
  it('should create an annotation', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      'document': {
        'uuid': faker.random.uuid(),
        'name': 'test-document-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'title': null,
        'content': faker.lorem.sentence(),
        'metadata': {},
        'mimetype': null,
        'is_active': true,
        'token_count': null,
        'created_at': '2015-07-15T20:23:40Z',
        'updated_at': '2015-07-15T20:23:40Z',
        'size': 15,
        'annotated_at': null,
        'language_id': null,
        'language': null,
        'annotations': [ {} ]
      }
    };
    var requestBody = Annotation.for(faker.lorem.words()[0], faker.lorem.words()[0]).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + collectionName + '/' + expectedResponse.document.name)
      .reply(200, expectedResponse);

    client.createAnnotation(collectionName, expectedResponse.document.name, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should delete annotation', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var documentName = 'test-document-' + faker.lorem.words()[0];
    var annotationUUID = faker.random.uuid();
    var expectedResponse = {
      "name": faker.lorem.words()[0],
      "delete": true
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .delete('/' + collectionName + '/' + documentName)
      .reply(200, expectedResponse);

    client.deleteAnnotation(collectionName, documentName, annotationUUID, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });
});