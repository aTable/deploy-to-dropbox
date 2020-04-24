# deploy-to-dropbox

A GitHub Action to deploy to Dropbox

## Initialisation

Follow [this guide](https://preventdirectaccess.com/docs/create-app-key-access-token-for-dropbox-account/#access-token) to create and get your access token

Save the token to your repository `Settings > Secrets`:

- Name: `DROPBOX_ACCESS_TOKEN`
- Value: `YOUR_TOKEN_FROM_DROPBOX_APP_CONSOLE`

## Usage

In your workflow add the following code:
```yaml
- name: Upload to Dropbox
    uses: rensatsu/deploy-to-dropbox@master
    with:
    DROPBOX_ACCESS_TOKEN: ${{ secrets.DROPBOX_ACCESS_TOKEN }}
    GLOB: dist/*
    FILE_WRITE_MODE: overwrite
```

## Inputs

* `DROPBOX_ACCESS_TOKEN` - Access token for Dropbox.
* `GLOB` - [Glob](https://www.npmjs.com/package/glob) pattern of files to upload.
* `FILE_WRITE_MODE` - Set file write mode when conflict occurs. Allowed modes: "add", "overwrite", "update".

Head over to [action.yml](action.yml) for more information about variables.

## Developing

For the lazy ...
```bash
git add -A && git commit -m "ci" && git tag -a -m "ci" v1.0.5 && git push --follow-tags
```

## Debugging

This action uses "Step Debug Logs" for debug output. You can enable debug
output by creating a new secret variable `ACTIONS_RUNNER_DEBUG` with
value `true`. [Click here][gh-step-debug] for more details.

[gh-step-debug]: https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#step-debug-logs