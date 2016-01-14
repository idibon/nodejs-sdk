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
 * Lists all collections that you can access. 
 * param argument[0] {String} API key
 */

var IdibonAPIClient = require('../../lib/idibon.js').IdibonAPIClient;

//argument 0 is the interpreter path and argument 1 is this file's path
if (process.argv.length !== 3) {
  throw new Error("Incorrect number of arguments provided. Usage is: " +
    "node listCollections.js $API_KEY");
}

var client = new IdibonAPIClient(process.argv[2]);

client.listCollections(function (err, resp) {
  if (!err && resp) {
    console.log(resp);
  } else {
    console.error("Error: %j", err);
  }
});