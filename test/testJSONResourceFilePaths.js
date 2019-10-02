/*
 * testJSONResourceFile.js - test the JavaScript file handler object.
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
        "json": "localized_json"
    }
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    id: "webos-web",
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
    testJSONResourceFileGetResourceFilePaths: function(test) {
        test.expect(193);
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
            "localized_json/af/strings.json",
            "localized_json/am/strings.json",
            "localized_json/ar/AE/strings.json",
            "localized_json/ar/BH/strings.json",
            "localized_json/ar/DJ/strings.json",
            "localized_json/ar/DZ/strings.json",
            "localized_json/ar/strings.json",
            "localized_json/ar/IQ/strings.json",
            "localized_json/ar/JO/strings.json",
            "localized_json/ar/KW/strings.json",
            "localized_json/ar/LB/strings.json",
            "localized_json/ar/LY/strings.json",
            "localized_json/ar/MA/strings.json",
            "localized_json/ar/MR/strings.json",
            "localized_json/ar/OM/strings.json",
            "localized_json/ar/QA/strings.json",
            "localized_json/ar/SA/strings.json",
            "localized_json/ar/SD/strings.json",
            "localized_json/ar/SY/strings.json",
            "localized_json/ar/TN/strings.json",
            "localized_json/ar/YE/strings.json",
            "localized_json/as/strings.json",
            "localized_json/az/strings.json",
            "localized_json/bg/strings.json",
            "localized_json/bn/strings.json",
            "localized_json/bs/strings.json",
            "localized_json/bs/Latn/ME/strings.json",
            "localized_json/cs/strings.json",
            "localized_json/da/strings.json",
            "localized_json/de/AT/strings.json",
            "localized_json/de/CH/strings.json",
            "localized_json/de/strings.json",
            "localized_json/de/LU/strings.json",
            "localized_json/el/CY/strings.json",
            "localized_json/el/strings.json",
            "localized_json/en/AM/strings.json",
            "localized_json/en/AU/strings.json",
            "localized_json/en/AZ/strings.json",
            "localized_json/en/CA/strings.json",
            "localized_json/en/CN/strings.json",
            "localized_json/en/ET/strings.json",
            "localized_json/en/GB/strings.json",
            "localized_json/en/GE/strings.json",
            "localized_json/en/GH/strings.json",
            "localized_json/en/GM/strings.json",
            "localized_json/en/HK/strings.json",
            "localized_json/en/IE/strings.json",
            "localized_json/en/IN/strings.json",
            "localized_json/en/IS/strings.json",
            "localized_json/en/JP/strings.json",
            "localized_json/en/KE/strings.json",
            "localized_json/en/LK/strings.json",
            "localized_json/en/LR/strings.json",
            "localized_json/en/MM/strings.json",
            "localized_json/en/MW/strings.json",
            "localized_json/en/MX/strings.json",
            "localized_json/en/MY/strings.json",
            "localized_json/en/NG/strings.json",
            "localized_json/en/NZ/strings.json",
            "localized_json/en/PH/strings.json",
            "localized_json/en/PK/strings.json",
            "localized_json/en/PR/strings.json",
            "localized_json/en/RW/strings.json",
            "localized_json/en/SD/strings.json",
            "localized_json/en/SG/strings.json",
            "localized_json/en/SL/strings.json",
            "localized_json/en/TW/strings.json",
            "localized_json/en/TZ/strings.json",
            "localized_json/en/UG/strings.json",
            "localized_json/en/strings.json",
            "localized_json/en/ZA/strings.json",
            "localized_json/en/ZM/strings.json",
            "localized_json/es/AR/strings.json",
            "localized_json/es/BO/strings.json",
            "localized_json/es/CA/strings.json",
            "localized_json/es/CL/strings.json",
            "localized_json/es/CO/strings.json",
            "localized_json/es/CR/strings.json",
            "localized_json/es/DO/strings.json",
            "localized_json/es/EC/strings.json",
            "localized_json/es/strings.json",
            "localized_json/es/GQ/strings.json",
            "localized_json/es/GT/strings.json",
            "localized_json/es/HN/strings.json",
            "localized_json/es/MX/strings.json",
            "localized_json/es/NI/strings.json",
            "localized_json/es/PA/strings.json",
            "localized_json/es/PE/strings.json",
            "localized_json/es/PH/strings.json",
            "localized_json/es/PR/strings.json",
            "localized_json/es/PY/strings.json",
            "localized_json/es/SV/strings.json",
            "localized_json/es/US/strings.json",
            "localized_json/es/UY/strings.json",
            "localized_json/es/VE/strings.json",
            "localized_json/et/strings.json",
            "localized_json/fa/AF/strings.json",
            "localized_json/fa/strings.json",
            "localized_json/fi/strings.json",
            "localized_json/fr/BE/strings.json",
            "localized_json/fr/BF/strings.json",
            "localized_json/fr/BJ/strings.json",
            "localized_json/fr/CA/strings.json",
            "localized_json/fr/CD/strings.json",
            "localized_json/fr/CF/strings.json",
            "localized_json/fr/CG/strings.json",
            "localized_json/fr/CH/strings.json",
            "localized_json/fr/CI/strings.json",
            "localized_json/fr/CM/strings.json",
            "localized_json/fr/GQ/strings.json",
            "localized_json/fr/DJ/strings.json",
            "localized_json/fr/DZ/strings.json",
            "localized_json/fr/strings.json",
            "localized_json/fr/GA/strings.json",
            "localized_json/fr/GN/strings.json",
            "localized_json/fr/LB/strings.json",
            "localized_json/fr/LU/strings.json",
            "localized_json/fr/ML/strings.json",
            "localized_json/fr/RW/strings.json",
            "localized_json/fr/SN/strings.json",
            "localized_json/fr/TG/strings.json",
            "localized_json/ga/strings.json",
            "localized_json/gu/strings.json",
            "localized_json/ha/strings.json",
            "localized_json/he/strings.json",
            "localized_json/hi/strings.json",
            "localized_json/hr/strings.json",
            "localized_json/hr/strings.json",
            "localized_json/hu/strings.json",
            "localized_json/id/strings.json",
            "localized_json/is/strings.json",
            "localized_json/it/CH/strings.json",
            "localized_json/it/strings.json",
            "localized_json/ja/strings.json",
            "localized_json/kk/strings.json",
            "localized_json/km/strings.json",
            "localized_json/kn/strings.json",
            "localized_json/ko/strings.json",
            "localized_json/ku/Arab/IQ/strings.json",
            "localized_json/lt/strings.json",
            "localized_json/lv/strings.json",
            "localized_json/mk/strings.json",
            "localized_json/ml/strings.json",
            "localized_json/mn/strings.json",
            "localized_json/mr/strings.json",
            "localized_json/ms/strings.json",
            "localized_json/ms/SG/strings.json",
            "localized_json/nb/strings.json",
            "localized_json/nl/BE/strings.json",
            "localized_json/nl/strings.json",
            "localized_json/or/strings.json",
            "localized_json/pa/strings.json",
            "localized_json/pa/PK/strings.json",
            "localized_json/pl/strings.json",
            "localized_json/pt/AO/strings.json",
            "localized_json/pt/strings.json",
            "localized_json/pt/GQ/strings.json",
            "localized_json/pt/CV/strings.json",
            "localized_json/pt/PT/strings.json",
            "localized_json/ro/strings.json",
            "localized_json/ru/BY/strings.json",
            "localized_json/ru/GE/strings.json",
            "localized_json/ru/KG/strings.json",
            "localized_json/ru/KZ/strings.json",
            "localized_json/ru/strings.json",
            "localized_json/ru/UA/strings.json",
            "localized_json/si/strings.json",
            "localized_json/sk/strings.json",
            "localized_json/sl/strings.json",
            "localized_json/sq/strings.json",
            "localized_json/sq/ME/strings.json",
            "localized_json/sr/Latn/ME/strings.json",
            "localized_json/sr/Latn/RS/strings.json",
            "localized_json/sv/FI/strings.json",
            "localized_json/sv/strings.json",
            "localized_json/sw/Latn/KE/strings.json",
            "localized_json/ta/strings.json",
            "localized_json/te/strings.json",
            "localized_json/th/strings.json",
            "localized_json/tr/AM/strings.json",
            "localized_json/tr/AZ/strings.json",
            "localized_json/tr/CY/strings.json",
            "localized_json/tr/strings.json",
            "localized_json/uk/strings.json",
            "localized_json/ur/IN/strings.json",
            "localized_json/ur/strings.json",
            "localized_json/uz/strings.json",
            "localized_json/vi/strings.json",
            "localized_json/zh/strings.json",
            "localized_json/zh/Hans/MY/strings.json",
            "localized_json/zh/Hans/SG/strings.json",
            "localized_json/zh/Hant/HK/strings.json",
            "localized_json/zh/Hant/TW/strings.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new JSONResourceFile({
                project: p2,
                locale: locales[i]
            });
            test.equal(jsrf.getResourceFilePath(), expected[i]);
        }
        test.done();
    },
};
