"use strict";
var Dropbox = require('dropbox').Dropbox;
var fs = require('fs');
var fetch2 = require('node-fetch');
var core = require('@actions/core');
var github = require('@actions/github');
var glob = require('glob');
var accessToken = core.getInput('DROPBOX_ACCESS_TOKEN');
var globSource = core.getInput('GLOB');
var dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX');
var isDebug = core.getInput('DEBUG');
var dropbox = new Dropbox({ accessToken: accessToken, fetch: fetch2 });
function uploadMuhFile(filePath) {
    var file = fs.readFileSync(filePath);
    var destinationPath = "" + dropboxPathPrefix + filePath;
    if (isDebug)
        console.log('uploaded file to Dropbox at: ', destinationPath);
    return dropbox
        .filesUpload({ path: destinationPath, contents: file })
        .then(function (response) {
        if (isDebug)
            console.log(response);
        return response;
    })
        .catch(function (error) {
        if (isDebug)
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
        console.error('error', err);
    });
});
