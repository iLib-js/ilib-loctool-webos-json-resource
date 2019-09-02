/*
 * testJSONResourceFile.js - test the JavaScript file handler object.
 *
 * Copyright © 2019, Box, Inc.
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
    id: "webos-web",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    localeDefaults: {
        "en": {
            def: "en-US",
            spec: "en"
        },
        "es": {
            def: "es-US",
            spec: "es"
        },
        "de": {
            def: "de-DE",
            spec: "de"
        },
        "zh-Hans": {
            def: "zh-Hans-CN",
            spec: "zh"
        },
        "zh-Hant": {
            def: "zh-Hant-HK",
            spec: "zh-Hant"
        }
    },
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
            pathName: "localized_js/en-US.js",
            locale: "en-US"
        });

        test.ok(jsrf);

        test.done();
    },

    testJSONResourceFileIsDirty: function(test) {
        test.expect(3);

        var jsrf = new JSONResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        test.ok(!jsrf.isDirty());

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellentext",\n' +
            '    "source text": "Quellentext",\n' +
            '    "yet more source text": "noch mehr Quellentext"\n' +
            '};\n'
        );

        test.done();
    },

    testJSONResourceFileGetContentsNoContent: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        test.equal(jsrf.getContent(),
            'ilib.data.strings_de_DE = {};\n'
        );

        test.done();
    },

    testJSONResourceFileEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\\"text",\n' +
            '    "source text": "Quellen\\"text"\n' +
            '};\n'
        );

        test.done();
    },

    testJSONResourceFileDontEscapeSingleQuotes: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\'text",\n' +
            '    "source text": "Quellen\'text"\n' +
            '};\n'
        );

        test.done();
    },

    testJSONResourceFileIdentifyResourceIds: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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

        test.equal(jsrf.getResourceFilePath(), "localized_js/de.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "de-DE"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-DE.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-AT.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-DE-ASDF.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/de-AT-ASDF.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hans-CN.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocaleForLanguageZH: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hant.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hans-SG.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/zh-Hant-TW.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathDefaultLocale: function(test) {
        test.expect(2);

        // should default to English/US
        var jsrf = new JSONResourceFile({
            project: p2
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/en.js");
        test.done();
    },

    testJSONResourceFileGetResourceFilePathAlreadyHasPath: function(test) {
        test.expect(2);

        var jsrf = new JSONResourceFile({
            project: p2,
            locale: "de-AT",
            pathName: "localized_js/foo.js"
        });

        test.ok(jsrf);

        test.equal(jsrf.getResourceFilePath(), "localized_js/foo.js");
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
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testJSONResourceFileGetContentDefaultLocaleNoDefaultsAvailable: function(test) {
        test.expect(2);

        var p3 = new CustomProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            identify: true
        });

        var jsrf = new JSONResourceFile({
            project: p3,
            locale: "de-DE"
        });

        test.ok(jsrf);

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "de-AT",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-AT",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_AT = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_zh = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_zh_Hant = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_zh_Hans_SG = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_zh_Hant_TW = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

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
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
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
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    }
};
