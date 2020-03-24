"use strict";
var Dropbox = require('dropbox').Dropbox;
var fs = require('fs');
var fetch2 = require('node-fetch');
var core = require('@actions/core');
var github = require('@actions/github');
var glob = require('glob');
var accessToken = core.getInput('DROPBOX_ACCESS_TOKEN') || process.env.DROPBOX_ACCESS_TOKEN;
if (!accessToken)
    core.setFailed('Error: missing DROPBOX_ACCESS_TOKEN');
var dropbox = new Dropbox({ accessToken: accessToken, fetch: fetch2 });
var globSource = core.getInput('GLOB') || 'sample/**/*.md';
if (!globSource)
    core.setFailed('Error: missing GLOB');
var dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX') || '/';
if (!dropboxPathPrefix)
    core.setFailed('Error: missing DROPBOX_DESTINATION_PATH_PREFIX');
function uploadMuhFile(filePath) {
    var file = fs.readFileSync(filePath);
    return dropbox
        .filesUpload({ path: "" + dropboxPathPrefix + filePath, contents: file })
        .then(function (response) {
        console.log(response);
        return response;
    })
        .catch(function (error) {
        console.error(error);
        return error;
    });
}
glob(globSource, {}, function (err, files) {
    if (err)
        core.setFailed('Error: glob failed', err);
    Promise.all(files.map(uploadMuhFile))
        .then(function (all) {
        console.log('all files uploaded', all);
    })
        .catch(function (err) {
        console.error('something errored', err);
    });
});
