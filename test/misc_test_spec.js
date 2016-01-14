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

var apiKey = "MY_API_KEY";
var client = new IdibonAPIClient(apiKey);

describe('Check miscellaneous helper functions', function () {
  it('should verify that encode function works', function (done) {
    var encoded = client.encode('%s/%s', 'unclear/name', 'requires/encoding');
    assert.equal(encoded, 'unclear%2Fname/requires%2Fencoding');
    done();
  });
});