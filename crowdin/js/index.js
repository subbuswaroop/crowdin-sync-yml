const axios = require('axios').default;
const JSZip = require("jszip");
const AdmZip = require('adm-zip');
/** CONFIG ENV VARIABLES */
// const BASE_URL = config.HOST + config.NAMESPACE + "projects/";
// const PROJECT_ID = config.PROJECT_ID;

// const CROWDIN_TOKEN = process.argv[3];
const CROWDIN_TOKEN = "2e6e3de1c20f73b61751dd1a62f8495fc080a93332eb58b23c834f664c17a2859dba93bd9996ae94";
// const CROWDIN_PROJECT_ID = process.argv[2];
const CROWDIN_PROJECT_ID = 483057;
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
  getDownloadURL();
  // const options = {
  //   method: "POST",
  //   ...HEADERS,
  //   data: {},
  //   url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds`
  // }

  // return axios(options).then(response=> {
  //   if(response.data && response.data.data) {
  //     let buildId = response.data.data.id;
  //     // The build process usually takes more than a minute due to large number of keys. So, we are only proceeding
  //     // to the next step if this build finishes. Until then, we check the status every 30 seconds
  //     checkBuilStatusInterval = setInterval(checkBuildStatus, 20000, buildId);

  //   }
  // })
}

function getDownloadURL(buildId) {
  console.log("Coming to Download");
  let zipURL = "";
  const options = {
    method: "GET",
    ...HEADERS,
    url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds/${7}/download`
  };

  axios(options).then(response=> {
    if(response.data) {
      zipURL = response.data.data.url;
      console.log(response.data.data.url);
      downloadTranslations(zipURL);
    }
  }).catch(err=> {
    console.log(err);
  })
  // `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/languages/${languageId}/translations`

}

function downloadTranslations(zipURL) {
  const options = {
    method: "GET",
    url: "https://github.com/mihaifm/linq/releases/download/3.1.1/linq.js-3.1.1.zip"
  };
  var data = [];

  axios.get(zipURL, { responseType: 'arraybuffer' }).then(res => {
    console.log('zip download status ', res.status);
    data.push(res.data);
    //load contents into jszip and create an object
    var buf = Buffer.concat(data);
    JSZip.loadAsync(buf).then((zip) => {
      const zipObj = zip
      zip.folder("locales-yml").forEach(function (relativePath, file){
          console.log("iterating over", relativePath);
      });
      // return zip.file("locales-yml/aa-ER.yml").async("string");
    }).then(function (text) {
      console.log(text);
    });
  });

  // axios(options).then(response=> {
  //   if(response && response.data) {
  //     var zip = new AdmZip(response);
  //     var zipEntries = zip.getEntries();
  //     console.log(zipEntries.length);
    
  //     zipEntries.forEach((entry) => {
  //       console.log(zip.readAsText(entry));
  //     });
  //   }
  // }).catch(err=> {
  //   console.log(err);
  // })
}

buildTranslations();
