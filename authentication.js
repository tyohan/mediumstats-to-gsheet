const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const OAuth2Client = google.auth.OAuth2;
const ACCESS_TOKEN_FILE='access_token.json';

module.exports = class Authentication{

    // Client ID and client secret are available at
    // https://code.google.com/apis/console
    constructor(client_id,client_secret,redirect_url,scope){
      this.scope=scope;
      this.oauth2Client = new OAuth2Client(client_id, client_secret, redirect_url);
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }

    getCachedAccessToken(){
      // Load client secrets from a local file.
      try {
        let access_token=fs.readFileSync(ACCESS_TOKEN_FILE);
        return JSON.parse(access_token);
      } catch (error) {
        return null;
      }
    }
    
    authorize (callback) {
      let tokens=this.getCachedAccessToken();
      if(tokens!==null){
        //access token cached
        this.oauth2Client.setCredentials(tokens);
        callback(this.oauth2Client);
      } else {
          // generate consent page url
          const url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
            scope: this.scope // can be a space-delimited string or an array of scopes
          });

          console.log('Visit the url: ', url);
          this.rl.question('Enter the code here:', code => {
            // request access token
            this.rl.close();
            this.oauth2Client.getToken(code, (err, tokens) => {
              if (err) {
                throw new Error(err);
              }
              // set tokens to the client
              // TODO: tokens should be set by OAuth2 client.
              this.oauth2Client.setCredentials(tokens);
              fs.writeFileSync(ACCESS_TOKEN_FILE, JSON.stringify(tokens));
              callback(this.oauth2Client);
            });

          });
      }
      
    }
    
};