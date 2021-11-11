const axios = require('axios').default;
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
        downloadTranslations();
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
      checkBuilStatusInterval = setInterval(checkBuildStatus, 5000, buildId);
    }
  })
}

function downloadTranslations() {
  console.log("Coming to Download");
}

buildTranslations();
