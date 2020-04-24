const Dropbox = require('dropbox').Dropbox
const fs = require('fs')
const fetch2 = require('node-fetch')
const core = require('@actions/core')
const github = require('@actions/github')
const glob = require('glob')

const accessToken = core.getInput('DROPBOX_ACCESS_TOKEN')
const globSource = core.getInput('GLOB')
const dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX')
const isDebug = core.getInput('DEBUG')
console.log('isDebug', isDebug, isDebug === true, isDebug === false, parseInt(isDebug), typeof isDebug);
const fileWriteMode = core.getInput('FILE_WRITE_MODE')
const dropbox = new Dropbox({accessToken, fetch: fetch2})

async function uploadFile(filePath: string): Promise<any> {
  const file = fs.readFileSync(filePath)
  const destinationPath = `${dropboxPathPrefix}${filePath}`
  if (isDebug) console.log('[Dropbox]', 'Uploaded file at: ', destinationPath)
  try {
    const response = await dropbox.filesUpload({
      path: destinationPath,
      contents: file,
      mode: fileWriteMode,
    })

    if (isDebug) console.log('[Dropbox]', 'File upload response', response)
    return response
  } catch (error) {
    if (isDebug) console.error('[Dropbox]', 'File upload error', error)
    return error
  }
}

glob(globSource, {}, (err: any, files: string[]) => {
  if (err) core.setFailed('Error: glob failed', err)
  Promise.all(files.map(uploadFile))
    .then((all) => {
      console.log('[Dropbox]', 'All files uploaded', all)
    })
    .catch((err) => {
      core.setFailed('Error: dropbox upload failed', err)
      console.error('[Dropbox]', 'Upload failed', err)
    })
})
