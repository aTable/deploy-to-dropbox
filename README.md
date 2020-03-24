# deploy-to-dropbox

A GitHub Action to deploy to Dropbox

## Initialisation

Follow [this guide](https://preventdirectaccess.com/docs/create-app-key-access-token-for-dropbox-account/#access-token) to create and get your access token

Save the token to your repository `Settings > Secrets`:

- Name: `DROPBOX_ACCESS_TOKEN`
- Value: `YOUR_TOKEN_FROM_DROPBOX_APP_CONSOLE`


## Developing

For the lazy ...
```bash
git add -A && git commit -m "ci" && git tag -a -m "ci" v1.0.5 && git push --follow-tags
```