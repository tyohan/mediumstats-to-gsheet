const puppeteer = require('puppeteer');
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const Authentication = require("./authentication");
const nconf = require('nconf');
const path = require('path');
const spreadsheetId='1ekABHP7hYTnVKn5ky5i_hweLcKuY43pmzZisaWjPZjU';


let getStats= async () => {
  
  const browser = await puppeteer.launch({
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
        //headless: false,
        userDataDir:'profile'
    });
  const page = await browser.newPage();
  const statsUrl='https://medium.com/wwwid/stats/stories';
  const statRowsSelector='.sortableTable-rowTitle';
  await page.goto(statsUrl);
  console.log('Opening '+statsUrl);
  await page.waitForSelector(statRowsSelector);
  // Extract the results from the page.
  const stats = await page.evaluate(statRowsSelector => {
    const stories = Array.from(document.querySelectorAll(statRowsSelector));

    return Promise.resolve(stories.map(story => {
      const title= story.parentElement.querySelector('.sortableTable-title').textContent;
      const url= story.parentElement.querySelector('.sortableTable-link').getAttribute('href');
      const dataList=story.parentElement.querySelectorAll('.sortableTable-value');
      const views=dataList[0].textContent;
      const reads=dataList[1].textContent;
      const fans=dataList[3].textContent;
      return [title,url,views,reads,fans];
    }));
  }, statRowsSelector);
  console.log('Closing browser...');
  await browser.close();
  return Promise.resolve(stats);
}



let updateData=  async (auth,data) =>  {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: 'ContentStats!B2:F'+(data.length+1), //Change Sheet1 if your worksheet's name is something else
      resource: {
        majorDimension: "ROWS",
        values: data
      },
      valueInputOption: "USER_ENTERED",
      
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      } else {
          console.log("Updated");
      }
    });
  }

  nconf.argv().env().file(path.join(__dirname, '/credentials.json'));
  const keys = nconf.get('web');
  const CLIENT_ID = keys.client_id;
  const CLIENT_SECRET = keys.client_secret;
  const REDIRECT_URL = keys.redirect_uris[0];
  const auth=new Authentication(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL,'https://www.googleapis.com/auth/spreadsheets');
  auth.authorize((auth)=>{
    getStats().then(stats=>{
      updateData(auth,stats);
    });
  });

  
  
 
