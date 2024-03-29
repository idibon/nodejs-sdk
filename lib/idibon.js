'use strict';

/**
 * @copyright
 * Copyright 2015 Idibon
 *
 * @license
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*jslint nomen: true, debug: true,
evil: false, vars: true, indent: 2 */

/**
 * @ignore
 */
var util = require('util');
var _ = require('underscore');
var request = require('request');
var async = require('async');
var constants = require('./constants');

/**
 * This module contains classes for interfacing with the Idibon API.
 * @module Idibon
 */

/**
 * @class IdibonBase
 * @constructor
 * @protected
 * @param apiKey {String} Api key
 * @param [uri = constants.uri] {String} Host uri
 * @param [timeout = constants.timeout] {Number} Connection timeout in milliseconds
 */
var IdibonBase = function (apiKey, uri, timeout) {

  /**
   * @property apiKey
   * @type String
   */
  this.apiKey = apiKey;

  /**
   * @property [uri = constants.uri]
   * @type String
   */
  this.uri = uri || constants.uri;

   /**
   * @property [uri = constants.timeout]
   * @type Number
   */
  this.timeout = timeout || constants.timeout;

  /**
   * @property request
   * @type request
   */
  this.request = request.defaults({
    timeout: this.timeout,
    jar: false,
    auth: {
      user: this.apiKey,
      password: ''
    }
  });

  /**
   * @property headers
   * @type Object
   */
  this.headers = {
    'User-Agent': constants.userAgent
  };

  /**
   * @property [maxSockets = constants.maxSockets]
   * @type Number
   */
  this.maxSockets = constants.maxSockets;
   /**
   * @property [headers = 'application/json; charset=utf-8']
   * @type Number
   */
  this.headers['Content-Type'] = 'application/json; charset=utf-8';
};

/**
 * Initiates the REST request to the API server and handles the response(s).
 * @protected
 * @param {String} path - Uri path
 * @param [data = null] - {Object} Request data
 * @param [method = GET] - {String} HTTP request method - GET, PUT, POST, DELETE
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonBase.prototype.callApi = function (path, data, method, callback) {
  method = method || 'GET';

  if (!_.isFunction(callback)) {
    callback = _.noop();
  }

  if (_.isFunction(data)) {
    callback = data;
    data = {};
  }

  if (_.isFunction(method)) {
    callback = method;
    method = 'GET';
  }

  var options = {
    uri: this.uri + path,
    method: method
  };

  options.body = JSON.stringify(data);
  options.headers = this.headers;

  options.pool = {
    maxSockets: this.maxSockets
  };
  this.request(options, function (err, resp, body) {
    if (err) {
      callback(err);
    } else if (!body) {
      callback(new Error('empty response'));
    } else {
      try {
        data = JSON.parse(body);
      } catch (error) {
        callback(new Error('Idibon failed JSON.parse:' + body));
      }
      if (_.isNull(data) || _.isUndefined(data)) {
        callback(new Error('undefined response: ' + util.inspect(resp)));
      } else {
        callback(null, data);
      }
    }
  });
};

/**
 * Encode corrects for abnormal characters in the URI
 * @param {String} [arguments[0]] format of final concatenated string
 * @param {String} [arguments[1,n]] strings to encode and concatenate
 */
IdibonBase.prototype.encode = function () {
  var encodedArguments = [];
  encodedArguments.push(_.first(arguments));
  _.each(_.rest(arguments), function (argument) {
    encodedArguments.push(encodeURIComponent(argument));
  });
  return util.format.apply(null, _.values(encodedArguments));
};

IdibonBase.prototype.updateConfigLabels = function (resp, collectionName, oldName, newName, callback) {
  var config = resp.task.config;
  var options = {};

  //handle subtasks
  if (!_.isUndefined(config.sub_tasks)) {
    var newSubtasks = {};
    var subtasks = config.sub_tasks;
    _.forEach(_.keys(subtasks), function (key) {
      if (key === oldName) {
        newSubtasks[newName] = subtasks[oldName];
      } else {
        newSubtasks[oldName] = subtasks[oldName];
      }
    });
    options.sub_tasks = newSubtasks;
  }

  //handle tuning dictionaries
  if (!_.isUndefined(config.tuning)) {
    var tuningDict = config.tuning;
    var newTuningDict = {};
    _.forEach(_.keys(tuningDict), function (key) {
      if (key === oldName) {
        newTuningDict[newName] = tuningDict[oldName];
      } else {
        newTuningDict[oldName] = tuningDict[oldName];
      }
    });
    options.tuning = newTuningDict;
  }

  //handle confidence thresholds
  if (!_.isUndefined(config.confidence_thresholds)) {
    var confThreshold = config.confidence_thresholds.labels;
    var newConfThreshold = {};
    _.forEach(_.keys(confThreshold), function (key) {
      if (key === oldName) {
        newConfThreshold[newName] = confThreshold[oldName];
      } else {
        newConfThreshold[oldName] = confThreshold[oldName];
      }
    });
    options.confidence_thresholds.labels = newConfThreshold;
  }

  this.callApi(this.encode('/%s/%s', collectionName, resp.task.name), {
    'task': options
  }, 'POST', function (err, resp) {
    if (!err && resp) {
      console.log("Response: ", resp);
      callback(null, config);
    } else {
      console.log("Failed to update config changes: ", err);
    }
  });
};


/**
 * IdibonAPIClient provides a way to interface with the Idibon API.
 * @class IdibonAPIClient
 * @constructor
 * @param apiKey {String} Api key
 * @param [uri = constants.uri] {String} Host uri
 * @param [timeout = constants.timeout] {Number} Connection timeout in milliseconds
 */
var IdibonAPIClient = function (apiKey, uri, timeout) {
  IdibonAPIClient.super_.call(this, apiKey, uri, timeout);
};
util.inherits(IdibonAPIClient, IdibonBase);

/**
 * Get documents associated with a collection.
 * @param collectionName {String} collection name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.fetchDocuments = function (collectionName, options, callback) {
  
  var self = this; //redefine this locally so it can be used within other functions
  if (_.isFunction(options)) {
    callback = options;
    options = {'cursor': null};
  } else {
    options.cursor = null;
  }
  if (!options.start){
    options.start = 0;
  }

  var batch_size = options.count || 1000;

  async.doWhilst(
    function (internal_callback) {
 
      self.callApi(self.encode('/%s/*', collectionName), options, function (err, resp) { 
        if (!err && resp) {
          options.cursor = resp.cursor; //update the cursor
          options.start = options.start + batch_size;
          _.each(resp.documents, function (document) {
            callback(null, document);
          })
          internal_callback(null); 
        } else {
          callback(err, resp);
          internal_callback(err);
        }
      })
    },
    function () { 
      return _.isString(options.cursor); //continue to iterate while the cursor is valid
    },
    function (err) {
      if (err) {
        console.error("Error: %j", err);
      }
    }
  );
};


/**
 * List all collections.
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.listCollections = function (callback) {
  this.callApi('/', 'GET', callback);
};

/**
 * Create a new collection.
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createCollection = function (options, callback) {
  this.callApi(this.encode('/%s', options.name), {
    'collection': options
  }, 'PUT', callback);
};

/**
 * Update a collection with new information.
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.updateCollection = function (collectionName, newDescription, callback) {
  this.callApi(this.encode('/%s', collectionName), {
    'collection': {'description': newDescription}
  }, 'POST', callback);
};

/**
 * Delete a collection. Requires that all documents have already been removed.
 * @param collectionName {String} collection name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.deleteCollection = function (collectionName, callback) {
  this.callApi(this.encode('/%s', collectionName), {
    'collection': true
  }, 'DELETE', callback);
};


/**
 * Fetch a specific document.
 * @param collectionName {String} collection name
 * @param documentName {String} document name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.fetchDocument = function (collectionName, documentName, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, documentName), callback);
};


/**
 * Get documents associated with a collection.
 * @param collectionName {String} collection name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createDocument = function (collectionName, documentName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, documentName), {
    "document": options
  }, 'PUT', callback);
};

/**
 * Create multiple documents simultaneously.
 * @param collectionName {String} collection name
 * @param options {list} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createDocuments = function (collectionName, options, callback) {
  this.callApi(this.encode('/%s/*', collectionName), {
    'documents': options
  }, 'POST', callback);
};

/**
 * Delete a document.
 * @param collectionName {String} collection name
 * @param documentName {String} document name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.deleteDocument = function (collectionName, documentName, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, documentName), {}, 'DELETE', callback);
};

/**
 * Create a task to attach to a collection.
 * @param collectionName {String} collection name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createTask = function (collectionName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, options.name), {
    'task': options
  }, 'PUT', callback);
};


/**
 * Fetch a specific task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.fetchTask = function (collectionName, taskName, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {}, 'GET', callback);
};

/**
 * Update a task with new information.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.updateTask = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    'task': options
  }, 'POST', callback);
};

/**
 * Add labels to a task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.addTaskLabels = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    'labels': options
  }, 'POST', callback);
};

/**
 * Remove a label from a task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param labelName {String} label name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.removeTaskLabel = function (collectionName, taskName, labelName, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    "label": labelName
  }, 'DELETE', callback);
};

/**
 * Renames a label. The original label can be identified by either a label name or a UUID.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * //@param options {object} options, hash containing label uuid and new label name
 * @param oldLabel {String} a UUID or a name of the original label
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.renameLabel = function (collectionName, taskName, oldLabel, newName, callback) {

  var self = this; //define 'this' out here so it can be used within functions
  var options = null;
  var oldName = null;
  var oldUUID = null;

  //Determines if the old label was passed in as a UUID or as a name
  self.fetchTask(collectionName, taskName, function (err, resp) {
    if (!err && resp) {
      var labels = resp.task.labels;
      var nameHash = {};
      var idHash = {};
      _.each(labels, function (label) {
        nameHash[label.name] = label.uuid;
        idHash[label.uuid] = label.name;
      });
      if (_.keys(nameHash).length === labels.length) {
        if (_.indexOf(_.keys(idHash), oldLabel) !== -1) {
          oldName = idHash[oldLabel];
          oldUUID = oldLabel;
        } else if (_.indexOf(_.keys(nameHash), oldLabel) !== -1) {
          oldName = oldLabel;
          oldUUID = nameHash[oldLabel];
        } else {
          throw new Error("Old Label does not exist");
        }

        //create the options hash from the original UUID and the new name
        options = {'labels': [
          {
            'uuid': oldUUID,
            'name': newName
          }
        ]};

        //make the call to rename the label
        self.callApi(self.encode('/%s/%s', collectionName, taskName),  options, 'POST', function (err, resp) {
          //propagate label name changes to the config hash.
          self.updateConfigLabels(resp, collectionName, oldName, newName, function (configErr, configResp) {
            callback(err, resp);
          });
        });
      } else {
        console.log("Failed to fetch task: ", err);
      }
    }
  });
};

/**
 * Set the tuning dictionary for a task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.setTuningDictionary = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    "task": {
      "config": {
        "tuning": options
      }
    }
  }, 'POST', callback);
};

/**
 * Set the confidence thresholds for labels of a task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.setConfidenceThreshold = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    "task": {
      "config": {
        "confidence_thresholds": {
          "labels": options
        }
      }
    }
  }, 'POST', callback);
};


/**
 * Create sub-tasks, or hierarchies, within a task.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createSubTask = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    "task": {
      "config": {
        "sub_tasks": options
      }
    }
  }, 'POST', callback);
};


/**
 * Delete a task from a collection.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.deleteTask = function (collectionName, taskName, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), {
    'task': true
  }, 'DELETE', callback);
};


/**
 * Create an annotation for a document.
 * @param collectionName {String} collection name
 * @param documentName {String} document name
 * @param options {object} options
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createAnnotation = function (collectionName, documentName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, documentName), {
    'annotations': options
  }, 'POST', callback);
};


/**
 * Delete an annotation from a collection.
 * @param collectionName {String} collection name
 * @param documentName {String} document name
 * @param annotationUUID {String} annotation UUID
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.deleteAnnotation = function (collectionName, documentName, annotationUUID, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, documentName), {
    'annotation': annotationUUID
  }, 'DELETE', callback);
};

/**
 * Get a prediction for new, unstored content.
 * @param collectionName {String} collection name
 * @param taskName {String} task name
 * @param content {String} content on which to create a prediction
 * @param [callback = null] - {Function} Function callback(err, resp) {}
 */
IdibonAPIClient.prototype.createClassification = function (collectionName, taskName, options, callback) {
  this.callApi(this.encode('/%s/%s', collectionName, taskName), options, 'GET', callback);
};


exports.IdibonAPIClient = IdibonAPIClient;