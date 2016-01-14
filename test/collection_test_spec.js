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
var Collection = require('../arg_builders/collection_arg_builder.js').Collection;

var apiKey = "MY_API_KEY";
var client = new IdibonAPIClient(apiKey);

describe('Create and delete collections', function () {
  it('should list all collections', function (done) {
    var expectedResponse = {
      "collections": [
        {
          "description": faker.lorem.words(),
          "name": faker.name.findName(),
          "touched_at": "2015-07-03T18:01:34Z",
          "uuid": faker.random.uuid()
        },
        {
          "description": faker.lorem.words(),
          "name": faker.name.findName(),
          "touched_at": "2015-07-03T18:01:34Z",
          "uuid": faker.random.uuid()
        }
      ]
    };
    nock('https://api.idibon.com/').
      matchHeader('User-Agent', /IdibonAPI:.*/).
      matchHeader('Authorization', /Basic.*/).
      get('/').
      reply(200, expectedResponse);
    client.listCollections(function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should test creating a collection', function (done) {
    var expectedResponse = {
      'collection': {
        'uuid': faker.random.uuid(),
        'subscriber_id': faker.random.uuid(),
        'name': 'test-collection-' + faker.lorem.words()[0],
        'description': faker.lorem.sentence(),
        'config': {},
        'is_public': false,
        'is_active': true,
        'created_at': '2015-07-15T20:10:32Z',
        'updated_at': '2015-07-15T20:10:32Z',
        'touched_at': null,
        'streams': [],
        'tasks': []
      }
    };

    var requestBody = Collection.for(
      expectedResponse.collection.name, 
      expectedResponse.collection.description).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .put('/' + expectedResponse.collection.name)
      .reply(200, expectedResponse);

    client.createCollection(requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should test updating a collection', function (done) {
    var expectedResponse = {
      "collection": {
        "description": faker.lorem.words()[0],
        "name": faker.name.firstName(),
        "touched_at": "2015-07-03T18:01:34Z",
        "uuid": "0001e53e-0ebc-5ecc-8068-aa40da1a7c73"
      }
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + expectedResponse.collection.name)
      .reply(200, expectedResponse);

    client.updateCollection(expectedResponse.collection.name, expectedResponse.collection.description, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should test deleting a collection', function (done) {

    var expectedResponse = {
      "name": faker.name.lastName(),
      "delete": true
    };

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .delete('/' + expectedResponse.name)
      .reply(200, expectedResponse);

    client.deleteCollection(expectedResponse.name, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });
});