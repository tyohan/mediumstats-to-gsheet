# mediumstats-to-gsheet
Scripts based on NodeJS to scrape Medium publication stats and update it in Google Sheet. The script created using [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scrape the data from Medium, [Google Authentication NodeJS library](https://github.com/google/google-auth-library-nodejs) and [Google API NodeJS library](https://github.com/google/google-api-nodejs-client)

## Setup
Install node modules dependencies.
```
npm install
```

Download Google API Credentials

1. Go to https://console.cloud.google.com/apis/credentials
2. Select project that you're working on or create a new one.
3. Go to Oauth Consent Screen tab and make sure you fill the name field and save
4. Go back to Credentials tab and create Oauth client id credentials
5. Download the credentials file after created and save with `credentials.json` in your project root directory
6. Check the cridentials.json content and make sure it's looks like this 
```
{"web":{"client_id":"xxx.apps.googleusercontent.com","project_id":"project-xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"xxx","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}} 
``` 
Make sure the key is `web` at the begining of the file, not sure what's the default key here. Mine was `install`. Just make sure it has the same key name in the script.

Update script file `index.js` 
1. Change the sheet-id for your Google Sheet document ` const spreadsheetId='1ekABHP7hYTnVKn5ky5i_hweLcKuY43pmzZisaWjPZjU';`
2. Change your Medium publication stat page url ` const statsUrl='https://medium.com/wwwid/stats/stories';`

