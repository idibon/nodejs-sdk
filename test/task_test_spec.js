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
var Task = require('../arg_builders/task_arg_builder.js').Task;
var Label = require('../arg_builders/label_arg_builder.js').Label;
var TuningDictionary = require('../arg_builders/tuning_dictionary_arg_builder.js').TuningDictionary;

var apiKey = "MY_APIKEY";
var client = new IdibonAPIClient(apiKey);

describe('Create and delete tasks and labels', function () {
  it('should create a task', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      task: {
        'uuid': faker.random.uuid(),
        'name': 'test-task-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'description': faker.lorem.sentence(),
        'scope': 'document',
        'trainable': true,
        'is_active': true,
        'created_at': '2015-07-15T20:39:53Z',
        'updated_at': '2015-07-15T20:39:53Z',
        'trained_at': null,
        'config': {},
        'touched_at': null,
        'features': [],
        'labels': []
      }
    };
    var requestBody = Task.for(
      expectedResponse.task.name,
      expectedResponse.task.description,
      expectedResponse.task.scope).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .put('/' + collectionName + '/' + expectedResponse.task.name)
      .reply(200, expectedResponse);

    client.createTask(collectionName, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should fetch task details', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      task: {
        'uuid': faker.random.uuid(),
        'name': 'test-task-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'description': faker.lorem.sentence(),
        'scope': 'document',
        'trainable': true,
        'is_active': true,
        'created_at': '2015-07-15T20:39:53Z',
        'updated_at': '2015-07-15T20:39:53Z',
        'trained_at': null,
        'config': {},
        'touched_at': null,
        'features': [],
        'labels': []
      }
    };
    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .get('/' +  collectionName + '/' + expectedResponse.task.name)
      .reply(200, expectedResponse);

    client.fetchTask(collectionName, expectedResponse.task.name, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should update a task', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      task: {
        'uuid': faker.random.uuid(),
        'name': 'test-task-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'description': faker.lorem.sentence(),
        'scope': 'document',
        'trainable': true,
        'is_active': true,
        'created_at': '2015-07-15T20:39:53Z',
        'updated_at': '2015-07-15T20:39:53Z',
        'trained_at': null,
        'config': {},
        'touched_at': null,
        'features': [],
        'labels': []
      }
    };
    var requestBody = Task.for(
      expectedResponse.task.name,
      expectedResponse.task.description,
      expectedResponse.task.scope).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + collectionName + '/' + expectedResponse.task.name)
      .reply(200, expectedResponse);

    client.updateTask(collectionName, requestBody.name, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should add some labels', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      task: {
        'uuid': faker.random.uuid(),
        'name': 'test-task-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'description': faker.lorem.sentence(),
        'scope': 'document',
        'trainable': true,
        'is_active': true,
        'created_at': '2015-07-15T20:39:53Z',
        'updated_at': '2015-07-15T20:39:53Z',
        'trained_at': null,
        'config': {},
        'touched_at': null,
        'features': [],
        'labels': [ {}, {}, {} ]
      }
    };
    var requestBody = Label.
      add_label(faker.lorem.words()[0], faker.lorem.sentence()).
      add_label(faker.lorem.words()[0], faker.lorem.sentence()).
      add_label(faker.lorem.words()[0], faker.lorem.sentence()).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + collectionName + '/' + expectedResponse.task.name)
      .reply(200, expectedResponse);

    client.addTaskLabels(collectionName, expectedResponse.task.name, requestBody, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should remove a task label', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var taskName = 'test-task-' + faker.lorem.words()[0];
    var expectedResponse = {
      "name": 'test-label-' + faker.lorem.words()[0],
      "deleted": true
    };
    var labelName = expectedResponse.name;
    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .delete('/' + collectionName + '/' + taskName)
      .reply(200, expectedResponse);

    client.removeTaskLabel(collectionName, taskName, labelName, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should delete the task', function (done) {
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

    client.deleteTask(collectionName, expectedResponse.name, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });

  it('should set a tuning dictionary', function (done) {
    var collectionName = 'test-collection-' + faker.lorem.words()[0];
    var expectedResponse = {
      task: {
        'uuid': faker.random.uuid(),
        'name': 'new-test-task-' + faker.lorem.words()[0],
        'collection_id': faker.random.uuid(),
        'description': faker.lorem.sentence(),
        'scope': 'document',
        'trainable': true,
        'is_active': true,
        'created_at': '2015-07-15T20:39:53Z',
        'updated_at': '2015-07-15T20:39:53Z',
        'trained_at': null,
        'config': {
          'tuning': {
            "country": {"truck": 0.99, "tears": 0.95},
            "pop": {"truck": 0.01, "tears": 0.05}
          }
        },
        'touched_at': null,
        'features': [],
        'labels': []
      }
    };
    var options = TuningDictionary.
      add_dict('country', 'truck', 0.99).
      add_dict('country', 'tears', 0.95).
      add_dict('pop', 'truck', 0.05).
      add_dict('pop', 'tears', 0.01).
      to_options();

    nock('https://api.idibon.com/')
      .matchHeader('User-Agent', /IdibonAPI:.*/)
      .matchHeader('Authorization', /Basic.*/)
      .post('/' + collectionName + '/' + expectedResponse.task.name)
      .reply(200, expectedResponse);

    client.setTuningDictionary(collectionName, expectedResponse.task.name, options, function (err, response) {
      assert.ok(_.isNull(err));
      assert.ok(response);
      assert.deepEqual(response, expectedResponse);
      done();
    });
  });
});

describe('Setting confidence thresholds to a label', function(){
  var collectionName = 'test-collection-' + faker.lorem.words()[0];
  var taskName = 'new-task-' + faker.lorem.words()[0];
  var labelName = 'new-label-name';
  var expectedURL = '/'+collectionName+'/'+taskName; 
  var ConfidenceThreshold = require('../arg_builders/confidence_threshold_arg_builder.js').ConfidenceThreshold;
  var callType = 'POST';

  var apiSpy; 
  var expectedBody; 

  //a general wrapper for adding confidences so we can test different scenarios 
  var add = function(label, threshold, noCall){

    var body = ConfidenceThreshold.add_threshold(label, threshold).
               to_options();
    //the actual call 
    if(!noCall){
      client.setConfidenceThreshold(collectionName, taskName, body, function(){}); 
    }
  }

  beforeEach(function(){
    apiSpy = spyOn(client, 'callApi');
    expectedBody = { task : { config : { confidence_thresholds : { labels : {} } } } }
  });

  //failure cases 
  it('Should throw an error if the threshold is greater than 1.', function(){
    expect(function(){add(labelName, 1.4);}).toThrow("Invalid threshold. Value must be between 0 and 1");
    expect(apiSpy).not.toHaveBeenCalled(); 
  });
  it('Should throw an error if the threshold is less than 0.', function(){
    expect(function(){add(labelName, -2);}).toThrow("Invalid threshold. Value must be between 0 and 1");
    expect(apiSpy).not.toHaveBeenCalled(); 
  });
  it('Should throw an error if the label is invalid.', function(){
    expect(add).toThrow("Invalid label passed to add_threshold method.");
    expect(function(){add(3);}).toThrow("Invalid label passed to add_threshold method.");
    expect(apiSpy).not.toHaveBeenCalled(); 
  });
  it('Should throw an error if the threshold is not a number.', function(){
    expect(function(){add(labelName);}).toThrow("Invalid threshold passed to add_threshold method. Threshold must be a value between 0 and 1.");
    expect(function(){add(labelName, "threshold");}).toThrow("Invalid threshold passed to add_threshold method. Threshold must be a value between 0 and 1.");
    expect(apiSpy).not.toHaveBeenCalled(); 
  });

  //Passing cases 
  it('should set a threshold for a label', function(){
    expectedBody.task.config.confidence_thresholds.labels = { "new-label-name": { "suggested": 0.4 } };

    add(labelName, 0.4); 
    expect(apiSpy).toHaveBeenCalled(); 

    var apiArgs = apiSpy.calls[0].args;

    expect(apiArgs[0]).toEqual(expectedURL); 
    expect(apiArgs[1]).toEqual(expectedBody); 
    expect(apiArgs[2]).toEqual(callType);
    expect(typeof apiArgs[3]).toBe("function");
  });
 

  it('should set two thresholds for different labels.', function(){;
    expectedBody.task.config.confidence_thresholds.labels =  { "new-label-name": { "suggested": 0.7 }, "new-label-name2" : { "suggested" : 0.5 }}; 

    //add thresholds for two different labels
    add(labelName, 0.7, true); 
    add(labelName + '2', 0.5);

    expect(apiSpy).toHaveBeenCalled(); 

    var apiArgs = apiSpy.calls[0].args;
    
    expect(apiArgs[0]).toEqual(expectedURL); 
    expect(apiArgs[1]).toEqual(expectedBody); 
    expect(apiArgs[2]).toEqual(callType);
    expect(typeof apiArgs[3]).toBe("function");
  });
});

describe('Adding subtasks', function(){
  var collectionName = 'test-collection-' + faker.lorem.words()[0];
  var taskName = 'new-test-task-' + faker.lorem.words()[0];
  var Subtask = require('../arg_builders/subtask_arg_builder.js').Subtask;
  var expectedURL = '/'+collectionName+'/'+taskName; 
  var callType = 'POST';
  var apiSpy; 
  var expectedBody;

  //a general function for adding subtasks so we can test different scenarios 
  var add = function(label, subTask1, subTask2, noCall) {
              var body = Subtask.add_subtask(label, subTask1, subTask2).
                         to_options();

              if(!noCall){
                client.createSubTask(collectionName, taskName, body, function(){}); 
              }
            }

  beforeEach(function(){
    apiSpy = spyOn(client, 'callApi');
    expectedBody = { task : { config : { sub_tasks : { } } } };
  });
  
  it('should throw an error when there is no label', function () {
    expect(add).toThrow("Invalid label passed to add_subtask method.");
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it('should throw an error when only a label is passed', function () {
    expect(function(){add("test-label");}).toThrow("Invalid task provided. Task names must be strings.");
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it('should create subtasks for a single provided label', function(){
    expectedBody.task.config.sub_tasks.pop = [ 'country', 'bluegrass' ]; 

    //Adding a the set of subtasks under the label "pop"
    add('pop', 'country', 'bluegrass');    
    
    expect(apiSpy).toHaveBeenCalled();
    var apiArgs = apiSpy.calls[0].args;
    
    expect(apiArgs[0]).toEqual(expectedURL);
    expect(apiArgs[1]).toEqual(expectedBody);
    expect(apiArgs[2]).toEqual(callType);
    expect(typeof apiArgs[3]).toBe("function");    
  });
  
  it('should create subtasks for multiple single provided labels', function(){

    expectedBody.task.config.sub_tasks.pop = [ 'country', 'bluegrass' ]; 
    expectedBody.task.config.sub_tasks.soul = [ 'rock', 'groove' ]; 


    //Adding a the set of subtasks under the label "pop"
    add('pop', 'country', 'bluegrass', true);
    //Adding another set under the label 'soul', should all go out in the same call
    add('soul', 'rock', 'groove'); 
    
    expect(apiSpy).toHaveBeenCalled();
    var apiArgs = apiSpy.calls[0].args;
    
    expect(apiArgs[0]).toEqual(expectedURL);
    expect(apiArgs[1]).toEqual(expectedBody);
    expect(apiArgs[2]).toEqual(callType);
    expect(typeof apiArgs[3]).toBe("function"); 
  });
});
