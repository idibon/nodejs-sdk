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
 * Fetches the documents in an existing collection. The relevant collection 
 * must exist. In this sample app, all documents are retrieved and are sorted in
 * ascending order by their created_at date. All arguments are passed in at 
 * the command line, and all are required for this sample application. 
 * param argument[0] {String} API key
 * param argument[1] {String} Collection name
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;
var DocumentQuery = require('../../arg_builders/document_query_arg_builder.js').DocumentQuery;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 4) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node fetchDocuments.js $API_KEY $COLLECTION");
}

var client = new IdibonAPIClient(process.argv[2]);

var collectionName = process.argv[3];
var options = DocumentQuery.
  in_ascending_order().
  to_options();

client.fetchDocuments(collectionName, options, function (err, resp) {
  if (!err && resp) {
    console.log('Response: ', resp);
  } else {
    console.log("Failed to fetch documents: ", err);
  }
});