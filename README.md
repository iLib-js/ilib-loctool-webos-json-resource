# ilib-loctool-webos-json-resource
ilib-loctool-webos-json-resource is a plugin for the loctool that
allows it to read and localize JSON resource files. This plugins is optimized for webOS platform.

## Release Notes

v1.2.0
* Support various resourceOutput file name. It can be specified according to project type.
    * If the project type is c or cpp program, it should be written in project configuration.
        ~~~~
        "settings": {
            "locales": ["en-US", "ko-KR", "zh-Hans-CN"],
            "resourceFileNames": {
                "c": "cstrings.json",
                "cpp": "cppstrings.json"
            }
        }
        ~~~~
v1.1.0
* Generate `ilibmanifest.json` file
    * Updated code to generate `ilibmanifest.json` file not to load unnecessary locale directories.
      It's implemented in projectClose()
v1.1.1
* Changed the way of generating manifestfile. it scans the resource output directory then add a list if the file exists.

## License

Copyright © 2019-2020, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
