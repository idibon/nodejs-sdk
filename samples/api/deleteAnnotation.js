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
 * Deletes an existing annotation. The relevant collection, document, and annotation
 * must already exist. All arguments are passed in at the command line, and 
 * all are required for this sample application. 
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name, the collection must exist
 * param argument[2] {String} Document name, the document that the annotation is attached to
 * param argument[3] {String} The annotation UUID
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 6) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node deleteAnnotation.js $API_KEY $COLLECTION $DOCUMENT $ANNOTATION_UUID");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var docName = process.argv[4];
var annotationUUID = process.argv[5];

client.deleteAnnotation(collectionName, docName, annotationUUID, function (err, resp) {
  if (!err && resp) {
    console.log("Response: ", resp);
  } else {
    console.log("Failed to delete the annotation", err);
  }
});
