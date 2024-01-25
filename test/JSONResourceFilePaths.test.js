/*
 * JSONResourceFile.test.js - test the JavaScript file handler object.
 *
 * Copyright (c) 2019-2024 JEDLSoft
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
    id: "webos-app",
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

var p3 = new CustomProject({
    id: "webosApp",
    projectType: "webos-c",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "localized_json"
    }
    }, "./testfiles", {
    identify: true,
    resourceFileNames: {
      "c": "cstrings.json"
    }
});

var p4 = new CustomProject({
    id: "webosApp",
    projectType: "webos-cpp",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "resources"
    }
    }, "./testfiles", {
    identify: true,
    resourceFileNames: {
      "cpp": "cppstrings.json"
    }
});

var p5 = new CustomProject({
    id: "webosApp",
    projectType: "webos-web",
    sourceLocale: "en-US",
    resourceDirs: {
        "json": "resources"
    }
    }, "./testfiles", {
    localeMap: {
        "es-CO": "es"
    }
});

var p6 = new CustomProject({
    id: "flutterHome",
    projectType: "webos-dart",
    sourceLocale: "en-KR",
    resourceDirs: {
        "json": "assets/i18n"
    }
    }, "./testfiles", {
    localeMap: {
        "es-CO": "es"
    },
    dart: {
        "mappings": {
            "**/*.dart": {
                "template": "[dir]/assets/i18n/[localeUnder].json"
            }
        }
    }
});

describe("jsonresourcefilepath", function() {
    test("JSONResourceFileConstructor", function() {
        expect.assertions(1);

        var jsrf = new JSONResourceFile({
            project: p
        });
        expect(jsrf).toBeTruthy();
    });
    test("JSONResourceFileGetResourceFilePaths", function() {
        expect.assertions(193);
        var jsrf;
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW","ar-LB","ar-LY","ar-MA","ar-MR","ar-OM","ar-QA","ar-SA","ar-SD",
        "ar-SY","ar-TN","ar-YE","as-IN","az-Latn-AZ","bg-BG","bn-IN","bs-Latn-BA","bs-Latn-ME",
        "cs-CZ","da-DK","de-AT","de-CH","de-DE","de-LU","el-CY","el-GR","en-AM","en-AU","en-AZ",
        "en-CA","en-CN","en-ET","en-GB","en-GE","en-GH","en-GM","en-HK","en-IE","en-IN","en-IS",
        "en-JP","en-KE","en-LK","en-LR","en-MM","en-MW","en-MX","en-MY","en-NG","en-NZ","en-PH",
        "en-PK","en-PR","en-RW","en-SD","en-SG","en-SL","en-TW","en-TZ","en-UG","en-US","en-ZA",
        "en-ZM","es-AR","es-BO","es-CA","es-CL","es-CO","es-CR","es-DO","es-EC","es-ES","es-GQ",
        "es-GT","es-HN","es-MX","es-NI","es-PA","es-PE","es-PH","es-PR","es-PY","es-SV","es-US",
        "es-UY","es-VE","et-EE","fa-AF","fa-IR","fi-FI","fr-BE","fr-BF","fr-BJ","fr-CA","fr-CD",
        "fr-CF","fr-CG","fr-CH","fr-CI","fr-CM","fr-GQ","fr-DJ","fr-DZ","fr-FR","fr-GA","fr-GN",
        "fr-LB","fr-LU","fr-ML","fr-RW","fr-SN","fr-TG","ga-IE","gu-IN","ha-Latn-NG","he-IL",
        "hi-IN","hr-HR","hr-ME","hu-HU","id-ID","is-IS","it-CH","it-IT","ja-JP","kk-Cyrl-KZ","km-KH",
        "kn-IN","ko-KR","ku-Arab-IQ","lt-LT","lv-LV","mk-MK","ml-IN","mn-Cyrl-MN","mr-IN","ms-MY",
        "ms-SG","nb-NO","nl-BE","nl-NL","or-IN","pa-IN","pa-PK","pl-PL","pt-AO","pt-BR","pt-GQ",
        "pt-CV","pt-PT","ro-RO","ru-BY","ru-GE","ru-KG","ru-KZ","ru-RU","ru-UA","si-LK","sk-SK",
        "sl-SI","sq-AL","sq-ME","sr-Latn-ME","sr-Latn-RS","sv-FI","sv-SE","sw-Latn-KE","ta-IN",
        "te-IN","th-TH","tr-AM","tr-AZ","tr-CY","tr-TR","uk-UA","ur-IN","ur-PK","uz-Latn-UZ","vi-VN",
        "zh-Hans-CN","zh-Hans-MY","zh-Hans-SG","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/localized_json/af/strings.json",
            "testfiles/localized_json/am/strings.json",
            "testfiles/localized_json/ar/AE/strings.json",
            "testfiles/localized_json/ar/BH/strings.json",
            "testfiles/localized_json/ar/DJ/strings.json",
            "testfiles/localized_json/ar/DZ/strings.json",
            "testfiles/localized_json/ar/strings.json",
            "testfiles/localized_json/ar/IQ/strings.json",
            "testfiles/localized_json/ar/JO/strings.json",
            "testfiles/localized_json/ar/KW/strings.json",
            "testfiles/localized_json/ar/LB/strings.json",
            "testfiles/localized_json/ar/LY/strings.json",
            "testfiles/localized_json/ar/MA/strings.json",
            "testfiles/localized_json/ar/MR/strings.json",
            "testfiles/localized_json/ar/OM/strings.json",
            "testfiles/localized_json/ar/QA/strings.json",
            "testfiles/localized_json/ar/SA/strings.json",
            "testfiles/localized_json/ar/SD/strings.json",
            "testfiles/localized_json/ar/SY/strings.json",
            "testfiles/localized_json/ar/TN/strings.json",
            "testfiles/localized_json/ar/YE/strings.json",
            "testfiles/localized_json/as/strings.json",
            "testfiles/localized_json/az/strings.json",
            "testfiles/localized_json/bg/strings.json",
            "testfiles/localized_json/bn/IN/strings.json",
            "testfiles/localized_json/bs/strings.json",
            "testfiles/localized_json/bs/Latn/ME/strings.json",
            "testfiles/localized_json/cs/strings.json",
            "testfiles/localized_json/da/strings.json",
            "testfiles/localized_json/de/AT/strings.json",
            "testfiles/localized_json/de/CH/strings.json",
            "testfiles/localized_json/de/strings.json",
            "testfiles/localized_json/de/LU/strings.json",
            "testfiles/localized_json/el/CY/strings.json",
            "testfiles/localized_json/el/strings.json",
            "testfiles/localized_json/en/AM/strings.json",
            "testfiles/localized_json/en/AU/strings.json",
            "testfiles/localized_json/en/AZ/strings.json",
            "testfiles/localized_json/en/CA/strings.json",
            "testfiles/localized_json/en/CN/strings.json",
            "testfiles/localized_json/en/ET/strings.json",
            "testfiles/localized_json/en/GB/strings.json",
            "testfiles/localized_json/en/GE/strings.json",
            "testfiles/localized_json/en/GH/strings.json",
            "testfiles/localized_json/en/GM/strings.json",
            "testfiles/localized_json/en/HK/strings.json",
            "testfiles/localized_json/en/IE/strings.json",
            "testfiles/localized_json/en/IN/strings.json",
            "testfiles/localized_json/en/IS/strings.json",
            "testfiles/localized_json/en/JP/strings.json",
            "testfiles/localized_json/en/KE/strings.json",
            "testfiles/localized_json/en/LK/strings.json",
            "testfiles/localized_json/en/LR/strings.json",
            "testfiles/localized_json/en/MM/strings.json",
            "testfiles/localized_json/en/MW/strings.json",
            "testfiles/localized_json/en/MX/strings.json",
            "testfiles/localized_json/en/MY/strings.json",
            "testfiles/localized_json/en/NG/strings.json",
            "testfiles/localized_json/en/NZ/strings.json",
            "testfiles/localized_json/en/PH/strings.json",
            "testfiles/localized_json/en/PK/strings.json",
            "testfiles/localized_json/en/PR/strings.json",
            "testfiles/localized_json/en/RW/strings.json",
            "testfiles/localized_json/en/SD/strings.json",
            "testfiles/localized_json/en/SG/strings.json",
            "testfiles/localized_json/en/SL/strings.json",
            "testfiles/localized_json/en/TW/strings.json",
            "testfiles/localized_json/en/TZ/strings.json",
            "testfiles/localized_json/en/UG/strings.json",
            "testfiles/localized_json/strings.json",
            "testfiles/localized_json/en/ZA/strings.json",
            "testfiles/localized_json/en/ZM/strings.json",
            "testfiles/localized_json/es/AR/strings.json",
            "testfiles/localized_json/es/BO/strings.json",
            "testfiles/localized_json/es/CA/strings.json",
            "testfiles/localized_json/es/CL/strings.json",
            "testfiles/localized_json/es/CO/strings.json",
            "testfiles/localized_json/es/CR/strings.json",
            "testfiles/localized_json/es/DO/strings.json",
            "testfiles/localized_json/es/EC/strings.json",
            "testfiles/localized_json/es/strings.json",
            "testfiles/localized_json/es/GQ/strings.json",
            "testfiles/localized_json/es/GT/strings.json",
            "testfiles/localized_json/es/HN/strings.json",
            "testfiles/localized_json/es/MX/strings.json",
            "testfiles/localized_json/es/NI/strings.json",
            "testfiles/localized_json/es/PA/strings.json",
            "testfiles/localized_json/es/PE/strings.json",
            "testfiles/localized_json/es/PH/strings.json",
            "testfiles/localized_json/es/PR/strings.json",
            "testfiles/localized_json/es/PY/strings.json",
            "testfiles/localized_json/es/SV/strings.json",
            "testfiles/localized_json/es/US/strings.json",
            "testfiles/localized_json/es/UY/strings.json",
            "testfiles/localized_json/es/VE/strings.json",
            "testfiles/localized_json/et/strings.json",
            "testfiles/localized_json/fa/AF/strings.json",
            "testfiles/localized_json/fa/strings.json",
            "testfiles/localized_json/fi/strings.json",
            "testfiles/localized_json/fr/BE/strings.json",
            "testfiles/localized_json/fr/BF/strings.json",
            "testfiles/localized_json/fr/BJ/strings.json",
            "testfiles/localized_json/fr/CA/strings.json",
            "testfiles/localized_json/fr/CD/strings.json",
            "testfiles/localized_json/fr/CF/strings.json",
            "testfiles/localized_json/fr/CG/strings.json",
            "testfiles/localized_json/fr/CH/strings.json",
            "testfiles/localized_json/fr/CI/strings.json",
            "testfiles/localized_json/fr/CM/strings.json",
            "testfiles/localized_json/fr/GQ/strings.json",
            "testfiles/localized_json/fr/DJ/strings.json",
            "testfiles/localized_json/fr/DZ/strings.json",
            "testfiles/localized_json/fr/strings.json",
            "testfiles/localized_json/fr/GA/strings.json",
            "testfiles/localized_json/fr/GN/strings.json",
            "testfiles/localized_json/fr/LB/strings.json",
            "testfiles/localized_json/fr/LU/strings.json",
            "testfiles/localized_json/fr/ML/strings.json",
            "testfiles/localized_json/fr/RW/strings.json",
            "testfiles/localized_json/fr/SN/strings.json",
            "testfiles/localized_json/fr/TG/strings.json",
            "testfiles/localized_json/ga/strings.json",
            "testfiles/localized_json/gu/strings.json",
            "testfiles/localized_json/ha/strings.json",
            "testfiles/localized_json/he/strings.json",
            "testfiles/localized_json/hi/strings.json",
            "testfiles/localized_json/hr/strings.json",
            "testfiles/localized_json/hr/ME/strings.json",
            "testfiles/localized_json/hu/strings.json",
            "testfiles/localized_json/id/strings.json",
            "testfiles/localized_json/is/strings.json",
            "testfiles/localized_json/it/CH/strings.json",
            "testfiles/localized_json/it/strings.json",
            "testfiles/localized_json/ja/strings.json",
            "testfiles/localized_json/kk/strings.json",
            "testfiles/localized_json/km/strings.json",
            "testfiles/localized_json/kn/strings.json",
            "testfiles/localized_json/ko/strings.json",
            "testfiles/localized_json/ku/Arab/IQ/strings.json",
            "testfiles/localized_json/lt/strings.json",
            "testfiles/localized_json/lv/strings.json",
            "testfiles/localized_json/mk/strings.json",
            "testfiles/localized_json/ml/strings.json",
            "testfiles/localized_json/mn/strings.json",
            "testfiles/localized_json/mr/strings.json",
            "testfiles/localized_json/ms/strings.json",
            "testfiles/localized_json/ms/SG/strings.json",
            "testfiles/localized_json/nb/strings.json",
            "testfiles/localized_json/nl/BE/strings.json",
            "testfiles/localized_json/nl/strings.json",
            "testfiles/localized_json/or/strings.json",
            "testfiles/localized_json/pa/strings.json",
            "testfiles/localized_json/pa/PK/strings.json",
            "testfiles/localized_json/pl/strings.json",
            "testfiles/localized_json/pt/AO/strings.json",
            "testfiles/localized_json/pt/strings.json",
            "testfiles/localized_json/pt/GQ/strings.json",
            "testfiles/localized_json/pt/CV/strings.json",
            "testfiles/localized_json/pt/PT/strings.json",
            "testfiles/localized_json/ro/strings.json",
            "testfiles/localized_json/ru/BY/strings.json",
            "testfiles/localized_json/ru/GE/strings.json",
            "testfiles/localized_json/ru/KG/strings.json",
            "testfiles/localized_json/ru/KZ/strings.json",
            "testfiles/localized_json/ru/strings.json",
            "testfiles/localized_json/ru/UA/strings.json",
            "testfiles/localized_json/si/strings.json",
            "testfiles/localized_json/sk/strings.json",
            "testfiles/localized_json/sl/strings.json",
            "testfiles/localized_json/sq/strings.json",
            "testfiles/localized_json/sq/ME/strings.json",
            "testfiles/localized_json/sr/Latn/ME/strings.json",
            "testfiles/localized_json/sr/Latn/RS/strings.json",
            "testfiles/localized_json/sv/FI/strings.json",
            "testfiles/localized_json/sv/strings.json",
            "testfiles/localized_json/sw/Latn/KE/strings.json",
            "testfiles/localized_json/ta/strings.json",
            "testfiles/localized_json/te/strings.json",
            "testfiles/localized_json/th/strings.json",
            "testfiles/localized_json/tr/AM/strings.json",
            "testfiles/localized_json/tr/AZ/strings.json",
            "testfiles/localized_json/tr/CY/strings.json",
            "testfiles/localized_json/tr/strings.json",
            "testfiles/localized_json/uk/strings.json",
            "testfiles/localized_json/ur/IN/strings.json",
            "testfiles/localized_json/ur/strings.json",
            "testfiles/localized_json/uz/strings.json",
            "testfiles/localized_json/vi/strings.json",
            "testfiles/localized_json/zh/strings.json",
            "testfiles/localized_json/zh/Hans/MY/strings.json",
            "testfiles/localized_json/zh/Hans/SG/strings.json",
            "testfiles/localized_json/zh/Hant/HK/strings.json",
            "testfiles/localized_json/zh/Hant/TW/strings.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p2,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("JSONResourceFileGetResourceFilePaths2", function() {
        expect.assertions(5);
        var jsrf;
        var locales = ["bs-Latn-BA", "ha-Latn-NG", "hr-ME", "mn-Cyrl-MN", "pa-IN"];
        var expected = [
            "testfiles/localized_json/bs/strings.json",
            "testfiles/localized_json/ha/strings.json",
            "testfiles/localized_json/hr/ME/strings.json",
            "testfiles/localized_json/mn/strings.json",
            "testfiles/localized_json/pa/strings.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p2,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("teasJSONResourceFileGetResourceFilePaths3", function() {
        expect.assertions(13);
        var jsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/localized_json/cstrings.json","testfiles/localized_json/en/GB/cstrings.json",
            "testfiles/localized_json/en/AU/cstrings.json","testfiles/localized_json/es/CO/cstrings.json",
            "testfiles/localized_json/es/cstrings.json","testfiles/localized_json/et/cstrings.json",
            "testfiles/localized_json/fa/cstrings.json","testfiles/localized_json/fa/AF/cstrings.json",
            "testfiles/localized_json/fr/cstrings.json","testfiles/localized_json/fr/CA/cstrings.json",
            "testfiles/localized_json/zh/cstrings.json","testfiles/localized_json/zh/Hant/HK/cstrings.json",
            "testfiles/localized_json/zh/Hant/TW/cstrings.json"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p3,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("JSONResourceFileGetResourceFilePaths4", function() {
        expect.assertions(15);
        var jsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "hr-HR", "hr-ME", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/resources/cppstrings.json","testfiles/resources/en/GB/cppstrings.json",
            "testfiles/resources/en/AU/cppstrings.json","testfiles/resources/es/CO/cppstrings.json",
            "testfiles/resources/es/cppstrings.json","testfiles/resources/et/cppstrings.json",
            "testfiles/resources/fa/cppstrings.json","testfiles/resources/fa/AF/cppstrings.json",
            "testfiles/resources/fr/cppstrings.json","testfiles/resources/fr/CA/cppstrings.json",
            "testfiles/resources/hr/cppstrings.json", "testfiles/resources/hr/ME/cppstrings.json",
            "testfiles/resources/zh/cppstrings.json","testfiles/resources/zh/Hant/HK/cppstrings.json",
            "testfiles/resources/zh/Hant/TW/cppstrings.json"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p4,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("JSONResourceFileGetResourceFilePathsOverride", function() {
        expect.assertions(5);
        var jsrf;

        var locales = ["en-GB", "de-DE", "de-AT", "es-CO", "es-ES"];

        var expected = [
            "testfiles/resources/en/GB/strings.json",
            "testfiles/resources/de/strings.json",
            "testfiles/resources/de/AT/strings.json",
            "testfiles/resources/es/strings.json",
            "testfiles/resources/es/ES/strings.json"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p5,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("JSONResourceFileGetResourceFilePaths_ko_US", function() {
        expect.assertions(1);
        var jsrf;
        var locale = "ko-US";
        var expected = "testfiles/localized_json/ko/US/strings.json";

        jsrf = new JSONResourceFile({
            project: p2,
            locale: locale
        });
        expect(jsrf.getResourceFilePath()).toBe(expected);
    });
    test("JSONResourceFileGetResourceFilePathsFlutter", function() {
        expect.assertions(5);
        var jsrf;

        var locales = ["en-GB", "de-DE", "de-AT", "es-CO", "es-ES"];

        var expected = [
            "testfiles/assets/i18n/en_GB.json",
            "testfiles/assets/i18n/de.json",
            "testfiles/assets/i18n/de_AT.json",
            "testfiles/assets/i18n/es.json",
            "testfiles/assets/i18n/es_ES.json"
        ];
        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p6,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
    test("JSONResourceFileGetResourceFilePathsFlutter2", function() {
        expect.assertions(15);
        var jsrf;
        var locales = ["en-US","en-GB", "en-AU", "es-CO",
                    "es-ES","et-EE","fa-IR","fa-AF","fr-FR","fr-CA", "hr-HR", "hr-ME", "zh-Hans-CN","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "testfiles/assets/i18n/en.json","testfiles/assets/i18n/en_GB.json",
            "testfiles/assets/i18n/en_AU.json","testfiles/assets/i18n/es.json",
            "testfiles/assets/i18n/es_ES.json","testfiles/assets/i18n/et.json",
            "testfiles/assets/i18n/fa.json","testfiles/assets/i18n/fa_AF.json",
            "testfiles/assets/i18n/fr.json","testfiles/assets/i18n/fr_CA.json",
            "testfiles/assets/i18n/hr.json", "testfiles/assets/i18n/hr_ME.json",
            "testfiles/assets/i18n/zh.json","testfiles/assets/i18n/zh_Hant_HK.json",
            "testfiles/assets/i18n/zh_Hant_TW.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p6,
                locale: locales[i]
            });
            expect(jsrf.getResourceFilePath()).toBe(expected[i]);
        }
    });
});