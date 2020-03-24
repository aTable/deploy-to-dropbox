# deploy-to-dropbox

A GitHub Action to deploy to Dropbox

## Initialisation

Follow [this guide](https://preventdirectaccess.com/docs/create-app-key-access-token-for-dropbox-account/#access-token) to create and get your access token

Save the token to your repository `Settings > Secrets`:

- Name: `DROPBOX_ACCESS_TOKEN`
- Value: `YOUR_TOKEN_FROM_DROPBOX_APP_CONSOLE`


## Developing

```bash
git add -A && git commit -m "testing" && git tag -a -m "test release" v1 && git push --follow-tags
```