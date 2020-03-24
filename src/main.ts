const Dropbox = require('dropbox').Dropbox
const fs = require('fs')
const fetch2 = require('node-fetch')
const core = require('@actions/core')
const github = require('@actions/github')
const glob = require('glob')

const accessToken = core.getInput('DROPBOX_ACCESS_TOKEN')
if (!accessToken) core.setFailed('Error: missing DROPBOX_ACCESS_TOKEN')
const dropbox = new Dropbox({accessToken, fetch: fetch2})

const globSource = core.getInput('GLOB')
if (!globSource) core.setFailed('Error: missing GLOB')

const dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX')
if (!dropboxPathPrefix)
  core.setFailed('Error: missing DROPBOX_DESTINATION_PATH_PREFIX')

const isDebug = core.getInput('DEBUG')

function uploadMuhFile(filePath: string): Promise<any> {
  const file = fs.readFileSync(filePath)
  return dropbox
    .filesUpload({path: `${dropboxPathPrefix}${filePath}`, contents: file})
    .then((response: any) => {
      if (isDebug) console.log(response)
      return response
    })
    .catch((error: any) => {
      if (isDebug) console.error(error)
      return error
    })
}

glob(globSource, {}, (err: any, files: string[]) => {
  if (err) core.setFailed('Error: glob failed', err)
  Promise.all(files.map(uploadMuhFile))
    .then((all) => {
      console.log('all files uploaded', all)
    })
    .catch((err) => {
      console.error('error', err)
    })
})
