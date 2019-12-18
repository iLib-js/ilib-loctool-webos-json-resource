/*
 * JSONResourceFile.js - represents an JSON style resource file
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

var fs = require("fs");
var path = require("path");
var Locale = require("ilib/lib/Locale.js");
var LocaleMatcher = require("ilib/lib/LocaleMatcher.js");
var log4js = require("log4js");
var logger = log4js.getLogger("loctool.plugin.JSONResourceFile");

/**
 * @class Represents an Android resource file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var JSONResourceFile = function(props) {
    var lanDefaultLocale, propsLocale;
    this.locale = new Locale();
    this.baseLocale = false;

    if (props) {
        this.project = props.project;
        this.locale = new Locale(props.locale);
        this.API = props.project.getAPI();

        langDefaultLocale = new LocaleMatcher({locale: this.locale.language});
        propsLocale = new LocaleMatcher({locale: this.locale});
        this.baseLocale = langDefaultLocale.getLikelyLocale().getSpec() === propsLocale.getLikelyLocale().getSpec();
    }

    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * We don't read javascript resource files. We only write them.
 */
JSONResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JSONResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JSONResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
JSONResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
JSONResourceFile.prototype.addResource = function(res) {
    logger.trace("JSONResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale.getSpec()) {
        logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale.getSpec());
            }
        } else {
            logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
JSONResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
JSONResourceFile.prototype.localize = function() {};

function clean(str) {
    if (!str) return;
    return str.replace(/\s+/, " ").trim();
}

/**
 * @private
 */
JSONResourceFile.prototype.getDefaultSpec = function() {
    if (!this.defaultSpec) {
        this.defaultSpec = this.project.settings.localeDefaults ?
            this.API.utils.getLocaleDefault(this.locale, this.flavor, this.project.settings.localeDefaults) :
            this.locale.getSpec();
    }

    return this.defaultSpec;
};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
JSONResourceFile.prototype.getContent = function() {
    var json = {};

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            if (resource.getSource() && resource.getTarget()) {
                if (clean(resource.getSource()) !== clean(resource.getTarget())) {
                    logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());
                    json[resource.getKey()] = this.project.settings.identify ?
                        '<span loclang="javascript" locid="' + resource.getKey() + '">' + resource.getTarget() + '</span>' :
                        resource.getTarget();
                } else {
                    logger.trace("skipping translation with no change");
                }
            } else {
                logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

    // allow for a project-specific prefix to the file to do things like importing modules and such
    var output = "";
    var settings = this.project.settings;
    if (settings && settings.JSONResourceFile && settings.JSONResourceFile.prefix) {
        output = settings.JSONResourceFile.prefix;
    }
    
    output += JSON.stringify(json, undefined, 4);

    // take care of double-escaped unicode chars
    output = output.replace(/\\\\u/g, "\\u");

    return output;
};

/**
 * @private
 */
JSONResourceFile.prototype._calcLocalePath = function(locale) {
    var path = "";
    var language = locale.language;
    var script = locale.script;
    var region = locale.region;


    if (language) {
        path += language + "/";
        if (this.baseLocale) {
            return path;
        }
    }
    if (script) {
        path += script + "/";
    }
    if (region) {
        path += region + "/";
    }
    return path;
}

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
JSONResourceFile.prototype.getResourceFilePath = function(locale, flavor) {
    var localeDir, dir, newPath, spec, localePath;
    locale = locale || this.locale;

    var defaultSpec = this.getDefaultSpec();
    localePath = this._calcLocalePath(locale);
    var filename = "strings.json";

    dir = this.project.getResourceDirs("json")[0] || ".";
    newPath = path.join(dir, localePath, filename);

    logger.trace("Getting resource file path for locale " + locale + ": " + newPath);
    return newPath;
};

/**
 * Write the resource file out to disk again.
 */
JSONResourceFile.prototype.write = function() {
    logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        this.defaultSpec = this.locale.getSpec();

        if (!this.pathName) {
            this.pathName = this.getResourceFilePath();
        }

        dir = path.dirname(this.pathName);
        this.API.utils.makeDirs(dir);

        var js = this.getContent();
        fs.writeFileSync(this.pathName, js, "utf8");
        logger.debug("Wrote string translations to file " + this.pathName);
    } else {
        logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};


/**
 * Write the manifest file to disk.
 */
JSONResourceFile.prototype.writeManifest = function(filePath) {
    logger.info("writing ilibmanifest.json file");
    var manifest = {
        files: []
    };

    if (!fs.existsSync(filePath)) return;

    function walk(root, dir) {
        var list = fs.readdirSync(path.join(root, dir));
        list.forEach(function (file) {
            var sourcePathRelative = path.join(dir, file);
            var sourcePath = path.join(root, sourcePathRelative);
            var stat = fs.statSync(sourcePath);
            if (stat && stat.isDirectory()) {
                walk(root, sourcePathRelative);
            } else {
                if (file.match(/\.json$/) && (file !== "ilibmanifest.json")) {
                    manifest.files.push(sourcePathRelative);
                }
            }
        });
    }

    walk(filePath, "");
    for (var i=0; i < manifest.files.length; i++) {
        console.log("list: ", manifest.files[i]);
    }
    var manifestFilePath = path.join(filePath, "ilibmanifest.json");
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest), 'utf8');
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
JSONResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = JSONResourceFile;
