/*
 * t1.js - test file
 *
 * Copyright © 2019, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 */

var fs = require("foobar");

var t1 = function() {
    console.log("If you find this, you found the wrong string!");
}

t1.prototype.tester = function() {
    RB.getString("This is a test");
    rb.getString("This is a test1");
    rb.getString("This is a test with a unique id", "id1");
    $L("This is a test with getString Wrapper");
};
