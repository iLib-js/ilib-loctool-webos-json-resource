/*
 * JSONResourceFileType.js - Represents a collection of JSON files
 *
 * Copyright © 2019-2020, JEDLSoft
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");
var FileType = require("loctool/lib/FileType.js");
var JSONResourceFile = require("./JSONResourceFile.js");
var logger = log4js.getLogger("loctool.plugin.JSONResourceFileType");

/**
 * @class Manage a collection of JSON resource files.
 *
 * @param {Project} project that this type is in
 */
var JSONResourceFileType = function(project) {
    this.parent.call(this, project);
    this.type = "json";
    this.datatype = "json";
    this.project = project;
    this.resourceFiles = {};
    this.API = project.getAPI();
    this.extensions = [".json"];
};

JSONResourceFileType.prototype = new FileType();
JSONResourceFileType.prototype.parent = FileType;
JSONResourceFileType.prototype.constructor = JSONResourceFileType;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
JSONResourceFileType.prototype.handles = function(pathName) {
    // json resource files are only generated. Existing ones are never read in.
    logger.debug("JSONResourceFileType handles " + pathName + "?");
    logger.debug("No");
    return false;
};

/**
 * Write out all resources for this file type. For JSON resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
JSONResourceFileType.prototype.write = function() {
    logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

JSONResourceFileType.prototype.name = function() {
    return "JSON Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {JSONResourceFile} a resource file instance for the
 * given path
 */
JSONResourceFileType.prototype.newFile = function(pathName) {
    var file = new JSONResourceFile({
        project: this.project,
        pathName: pathName,
        type: this,
        API: this.API
    });

    var locale = file.getLocale() || this.project.sourceLocale;

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {JSONResourceFile} the JSON resource file that serves the
 * given project, context, and locale.
 */
JSONResourceFileType.prototype.getResourceFile = function(locale) {
    var key = locale || this.project.sourceLocale;
    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new JSONResourceFile({
            project: this.project,
            locale: key
        });

        logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
JSONResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
            logger.trace("Generating pseudo for " + resource.getKey());
            var res = resource.generatePseudo(locale, pb);
            if (res && res.getSource() !== res.getTarget()) {
                this.pseudo.add(res);
            }
        }
    }.bind(this));
};

JSONResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

JSONResourceFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
JSONResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JSONResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
JSONResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
JSONResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Called right before each project is closed
 * Allows the file type class to do any last-minute clean-up or generate any final files
 *
 * Generate manifest file based on created resource files
 */
JSONResourceFileType.prototype.projectClose = function() {
    var resourceRoot = this.project.getResourceDirs("json")[0] || "resources";
    var manifestFile = new JSONResourceFile({project: this.project});
    manifestFile.writeManifest(resourceRoot);
};
module.exports = JSONResourceFileType;
