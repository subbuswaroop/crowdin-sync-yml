const axios = require('axios').default;
const AdmZip = require("adm-zip");
const shell = require('shelljs');
/** CONFIG ENV VARIABLES */
const BASE_URL = "https://api.crowdin.com/api/v2/projects";
// const PROJECT_ID = config.PROJECT_ID;

const CROWDIN_TOKEN = process.argv[3];
const CROWDIN_PROJECT_ID = process.argv[2];

const PROVIDER_CODE = ["es-ES", "ja", "es-MX", "no", "pt", "pt", "ru", "sv"];
const APP_CODE = ["es", "ja-JP", "es-LA", "nb-NO", "pt-BR", "pt-PT", "ru-RU", "sv-SE"];
const BASE_LANG = 'en';

var checkBuilStatusInterval = null;
const HEADERS = {
  headers: {
    'Authorization': `Bearer ${CROWDIN_TOKEN}`
  }
};

function checkBuildStatus(buildId) {
  console.log("Checking Build Status...");
  const options = {
    method: "GET",
    ...HEADERS,
    url: `${BASE_URL}/${CROWDIN_PROJECT_ID}/translations/builds/${buildId}`
  };

  return axios(options).then(response=> {
    if(response.data && response.data.data) {
      const status = response.data.data.status;
      console.log("Status:: ", status);
      if(status == "inProgress") {
        return status;
      } else if(status == "finished") {
        clearInterval(checkBuilStatusInterval);
        getDownloadURL(buildId);
      }
      return status;
    }
  })
}

function buildTranslations() {
  console.log("Building Translations...");
  const options = {
    method: "POST",
    ...HEADERS,
    data: {},
    url: `${BASE_URL}/${CROWDIN_PROJECT_ID}/translations/builds`
  }

  return axios(options).then(response=> {
    if(response.data && response.data.data) {
      let buildId = response.data.data.id;
      // The build process usually takes more than a minute due to large number of keys. So, we are only proceeding
      // to the next step if this build finishes. Until then, we check the status every 30 seconds
      checkBuilStatusInterval = setInterval(checkBuildStatus, 30000, buildId);
    }
  })
}

function getDownloadURL(buildId) {
  console.log("Fetching zip download url...");
  let zipURL = "";
  const options = {
    method: "GET",
    ...HEADERS,
    url: `${BASE_URL}/${CROWDIN_PROJECT_ID}/translations/builds/${buildId}/download`
  };

  axios(options).then(response=> {
    if(response && response.data) {
      zipURL = response.data.data.url;
      downloadTranslations(zipURL);
    }
  }).catch(err=> {
    console.log(err);
  })
  // `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/languages/${languageId}/translations`

}

function downloadTranslations(zipURL) {
  console.log("Downloading Translations...");
  axios.get(zipURL, { responseType: 'arraybuffer' }).then(res => {
    console.log('zip download status ', res.status);
    var zipFile = new AdmZip(res.data);
    var zipEntries = zipFile.getEntries();
    shell.exec("chmod +x yaml_merge.sh"); // Give access for the script file

    zipEntries.forEach(function (entry, indx) {
      let destfilename = entry.entryName.split("/")[0]; // Get the destination file name in the helpkit folder
      let sourceFilename = entry.entryName.split("/")[1];
      if(indx % 2 == 0 || destfilename.includes(BASE_LANG)) return; // There will be two entries for each file like "ar" and "ar/ar-SA.yml". Ignoring the first one in all iterations
      
      zipFile.extractEntryTo(entry.entryName, './tmp', false, true); // Extract the yml data to a tmp file
            
      if(PROVIDER_CODE.indexOf(destfilename) > -1) { // Some folder names of the providers doesn't match the destination. So, handling it accordingly
        destfilename = APP_CODE[PROVIDER_CODE.indexOf(destfilename)];
      };

      console.log("Destination Filename:", destfilename);
      console.log("Source Filename:", sourceFilename);
      // Merge source and destination yml files
      shell.exec(`./yaml_merge.sh ${sourceFilename} ${destfilename}`);
    });

    console.log("Removing package lock json file");
    shell.exec('cd js && [ -f "package-lock.json" ] && rm package-lock.json && cd ..')
  });
}

buildTranslations();
