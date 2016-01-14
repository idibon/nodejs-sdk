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
var Document = require('../arg_builders/document_arg_builder.js').Document;

var apiKey = "MY_API_KEY";
var client = new IdibonAPIClient(apiKey);


describe('Create and delete documents', function () {
  it('should create a document', function (done) {
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
        'annotations': []
      }
    };

    var requestBody = Document.for(faker.lorem.sentence()).
      with_name(faker.lorem.words()[0]).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .put('/' + collectionName + '/' + expectedResponse.document.name)
      .reply(200, expectedResponse);

    client.createDocument(collectionName, expectedResponse.document.name, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should fetch the document', function (done) {
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
        'annotations': []
      }
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .get('/' + collectionName + '/' + expectedResponse.document.name)
      .reply(200, expectedResponse);

    client.fetchDocument(collectionName, expectedResponse.document.name, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should fetch multiple documents in a collection', function (done) {
    //this expected response is actually hidden from the user. It's intercepted
    //and a stream of documents (only one in this list) is what is passed as 
    //the response to the callback function.
    var collectionName = faker.lorem.words()[0];
    var expectedResponse = {
      'start': faker.random.number(),
      'total': faker.random.number(),
      'cursor': null,
      'documents': [
        {'name': faker.random.number(), 'created_at': faker.random.number() }
      ],
      'count': 1,
      'sort': 'created_at',
      'order': 'asc',
      'full': false,
      'stream': false
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .get('/' + collectionName + '/*')
      .reply(200, expectedResponse);

    client.fetchDocuments(collectionName, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse.documents[0]);
      done();
    });
  });

  it('should delete the document', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      "name": faker.name.lastName(),
      "deleted": true
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .delete('/' + collectionName + '/' + expectedResponse.name)
      .reply(200, expectedResponse);

    client.deleteDocument(collectionName, expectedResponse.name, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should create many documents at once', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var requestBody = [
      {
        "content": faker.lorem.sentence()
      },
      {
        "content": faker.lorem.sentence()
      },
      {
        "content": faker.lorem.sentence()
      }
    ];
    var expectedResponse = {
      "documents": [
        {
          "uuid": faker.random.uuid(),
          "name": "4371cfe0244b4411abbc4457db3eb8f5"
        },
        {
          "uuid": faker.random.uuid(),
          "name": "022eb31678e44f3bafb9d02100f47585"
        }
      ]
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + collectionName + '/*')
      .reply(200, expectedResponse);

    client.createDocuments(collectionName, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });
});