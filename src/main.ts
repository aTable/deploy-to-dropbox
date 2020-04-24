const Dropbox = require('dropbox').Dropbox
const fs = require('fs')
const fetch2 = require('node-fetch')
const core = require('@actions/core')
const github = require('@actions/github')
const glob = require('glob')

const accessToken = core.getInput('DROPBOX_ACCESS_TOKEN')
const globSource = core.getInput('GLOB')
const dropboxPathPrefix = core.getInput('DROPBOX_DESTINATION_PATH_PREFIX')
const fileWriteMode = core.getInput('FILE_WRITE_MODE')
const dropbox = new Dropbox({ accessToken, fetch: fetch2 })

async function uploadFile(filePath: string): Promise<any> {
  const file = fs.readFileSync(filePath)
  const destinationPath = `${dropboxPathPrefix}${filePath}`
  core.debug(`[Dropbox] Uploaded file at: ${destinationPath}`)

  try {
    const response = await dropbox.filesUpload({
      path: destinationPath,
      contents: file,
      mode: fileWriteMode,
    })

    core.debug('[Dropbox] File upload response: ' + JSON.stringify(response))
    return response
  } catch (error) {
    core.error('[Dropbox] File upload error: ' + JSON.stringify(error))
    return error
  }
}

glob(globSource, {}, (err: any, files: string[]) => {
  if (err) core.setFailed(`Error: glob failed: ${err.message}`)
  Promise.all(files.map(uploadFile))
    .then((all) => {
      core.debug('[Dropbox] All files uploaded: ' + JSON.stringify(all))
      console.log('[Dropbox] Upload completed')
    })
    .catch((err) => {
      core.setFailed(`Error: Dropbox upload failed: ${err.message}`)
      core.error('[Dropbox] Upload failed: ' + JSON.stringify(err))
    })
})
