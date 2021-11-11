const axios = require('axios').default;
const AdmZip = require('adm-zip');
/** CONFIG ENV VARIABLES */
// const BASE_URL = config.HOST + config.NAMESPACE + "projects/";
// const PROJECT_ID = config.PROJECT_ID;

const CROWDIN_TOKEN = process.argv[3];
const CROWDIN_PROJECT_ID = process.argv[2];
var checkBuilStatusInterval = null;
const HEADERS = {
  headers: {
    'Authorization': `Bearer ${CROWDIN_TOKEN}`
  }
};

function checkBuildStatus(buildId) {
  const options = {
    method: "GET",
    ...HEADERS,
    url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds/${buildId}`
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
  const options = {
    method: "POST",
    ...HEADERS,
    data: {},
    url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds`
  }

  return axios(options).then(response=> {
    if(response.data && response.data.data) {
      let buildId = response.data.data.id;
      // The build process usually takes more than a minute due to large number of keys. So, we are only proceeding
      // to the next step if this build finishes. Until then, we check the status every 30 seconds
      checkBuilStatusInterval = setInterval(checkBuildStatus, 5000, buildId);
    }
  })
}

function getDownloadURL(buildId) {
  console.log("Coming to Download");
  let zipURL = "";
  const options = {
    method: "GET",
    ...HEADERS,
    url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds/${buildId}/download`
  };

  axios(options).then(response=> {
    if(response.data) {
      zipURL = response.data.url;
      console.log(response.data);
      downloadTranslations(zipURL);
    }
  })
  // `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/languages/${languageId}/translations`

}

function downloadTranslations(zipURL) {
  const options = {
    method: "GET",
    responseType: "arraybuffer",
    ...HEADERS,
    url: zipURL
  };

  axios(options).then(response=> {
    if(response && response.data) {
      var zip = new AdmZip(response.data);
      var zipEntries = zip.getEntries();
      console.log(zipEntries.length);
    
      zipEntries.forEach((entry) => {
        console.log(zip.readAsText(entry));
      });
    }
  })
}

buildTranslations();
