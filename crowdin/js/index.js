const axios = require('axios').default;
/** CONFIG ENV VARIABLES */
// const BASE_URL = config.HOST + config.NAMESPACE + "projects/";
// const PROJECT_ID = config.PROJECT_ID;

const CROWDIN_TOKEN = process.args[3];
const CROWDIN_PROJECT_ID = process.args[2];
console.log(CROWDIN_PROJECT_ID);
console.log(CROWDIN_TOKEN);
const HEADERS = {
  headers: {
    'Authorization': `Bearer ${CROWDIN_TOKEN}`
  }
};

function buildTranslations() {
  const options = {
    method: "POST",
    ...HEADERS,
    data: {},
    url: `https://api.crowdin.com/api/v2/projects/${CROWDIN_PROJECT_ID}/translations/builds`
  }

  return axios(options).then(response=> {
    console.log(response);
  })
}

buildTranslations();
