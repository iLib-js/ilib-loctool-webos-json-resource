/*
 * testJSONResourceFile.js - test the JavaScript file handler object.
 *
 * Copyright (c) 2019-2020, JEDLSoft
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
 * limitations under the License.
 */

if (!JSONResourceFile) {
    var JSONResourceFile = require("../JSONResourceFile.js");
    var CustomProject = require("loctool/lib/CustomProject.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

var p = new CustomProject({
    id: "webosApp",
    projectType: "webos-web",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_json"
        }
    }, "./testfiles", {
        locales:["en-GB"]
    });

var p2 = new CustomProject({
    id: "webosApp",
    projectType: "webos-web",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_json"
        }
    }, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    identify: true
});

module.exports.jsonresourcefile = {
    testJSONResourceFileConstructor: function(test) {
        test.expect(1);

        var jsrf = new JSONResourceFile({
            project: p
        });
        test.ok(jsrf);
        test.done();
    },

    testJSONResourceFileConstructorParams: function(test) {
        test.expect(1);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "en-US"
        });

        test.ok(jsrf);
        test.done();
    },
    testJSONResourceFileIsDirty: function(test) {
        test.expect(3);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.ok(!jsrf.isDirty());

        [
            p.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.ok(jsrf.isDirty());
        test.done();
    },

    testJSONResourceFileRightContents: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellentext",\n' +
            '    "source text": "Quellentext",\n' +
            '    "yet more source text": "noch mehr Quellentext"\n' +
            '}'
        );

        test.done();
    },

    testJSONResourceFileGetContentsNoContent: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.equal(jsrf.getContent(),'{}');
        test.done();
    },

    testJSONResourceFileEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen\"text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellen\\"text",\n' +
            '    "source text": "Quellen\\"text"\n' +
            '}'
        );
        test.done();
    },

    testJSONResourceFileDontEscapeSingleQuotes: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen'text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        test.equal(jsrf.getContent(),
            '{\n' +
            '    "more source text": "mehr Quellen\'text",\n' +
            '    "source text": "Quellen\'text"\n' +
            '}'
        );

        test.done();
    },

    testJSONResourceFileIdentifyResourceIds: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/AT/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/AT/ASDF/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/zh/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/zh/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/zh/Hant/HK/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/zh/Hans/SG/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/zh/Hant/TW/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocale: function(test) {
        test.expect(2);

        // should default to English/US
        var jsrf = new JSONResourceFile({
            project: p2
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/strings.json");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathAlreadyHasPath: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(jsrf);
        test.equal(jsrf.getResourceFilePath(), "testfiles/localized_json/de/AT/strings.json");
        test.done();
    },

    testJSONResourceFileGetContentDefaultLocale: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentDefaultLocaleNoDefaultsAvailable: function(test) {
        test.expect(2);

        var customP = new CustomProject({
            id: "webosApp",
            sourceLocale: "en-US",
            resourceDirs: {
                "json": "localized_json"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            identify: true
        });

        var jsrf = new JSONResourceFile({
            project: customP,
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            customP.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            customP.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            customP.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentNonDefaultLocale: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-AT",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-AT",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-AT",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentDefaultLocaleZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-CN",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-CN",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-CN",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentDefaultLocaleZH2: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-HK",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-HK",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-HK",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentNonDefaultLocaleZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-SG",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-SG",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hans-SG",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentNonDefaultLocaleZH2: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-TW",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-TW",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "zh-Hant-TW",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },

    testJSONResourceFileGetContentNonDefaultLocaleWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webosApp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '{\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '}';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);
        test.done();
    },
    teasJSONResourceFileGetResourceFilePaths: function(test) {
        test.expect(13);
        var jsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/localized_json/strings.json","testfiles/localized_json/en/GB/strings.json",
            "testfiles/localized_json/en/AU/strings.json","testfiles/localized_json/es/CO/strings.json",
            "testfiles/localized_json/es/strings.json","testfiles/localized_json/et/strings.json",
            "testfiles/localized_json/fa/strings.json","testfiles/localized_json/fa/AF/strings.json",
            "testfiles/localized_json/fr/strings.json","testfiles/localized_json/fr/CA/strings.json",
            "testfiles/localized_json/zh/strings.json","testfiles/localized_json/zh/Hant/HK/strings.json",
            "testfiles/localized_json/zh/Hant/TW/strings.json"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p2,
                locale: locales[i]
            });
            test.equal(jsrf.getResourceFilePath(), expected[i]);
        }
        test.done();
    }
};